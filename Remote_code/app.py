import gradio as gr
import joblib
import xgboost as xgb
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import numpy as np
import pandas as pd
from supabase import create_client, Client
from google import genai
import os


apikey = os.getenv('gemini_secret')
client = genai.Client(api_key=apikey)

supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
supabase_anon_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase: Client = create_client(supabase_url, supabase_anon_key)

# Load BERT model & tokenizer
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-cased")
model = AutoModelForSequenceClassification.from_pretrained('distilbert-base-cased', num_labels=5,output_hidden_states=True)
from safetensors.torch import load_file
state_dict = load_file("model (4).safetensors")

# Load the state into the model
model.load_state_dict(state_dict,strict=False)
model.eval()

# Load PCA and Scaler
pca = joblib.load("pca.pkl")
scaler = joblib.load("scaler.pkl")
kmean=joblib.load("kmeans_model.pkl")

# Load XGBoost model
xgb_model = xgb.XGBClassifier()
xgb_model.load_model("xgb_model.json")

category_mappings = {
    "kmeans_labels": pd.Index([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], dtype='int32')
}


def combine_document_features(component, description):
    return f"Component is {component} with Description {description}"


def retrieve_similar_documents(component, description,pid):
    new_doc_text = combine_document_features(component, description)
    inputs = tokenizer(new_doc_text, return_tensors="pt", truncation=True,max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
        new_embedding = outputs.hidden_states[-1][:, 0, :][0].tolist()

    # Get all documents from the "bugs" table
    response = supabase.rpc("get_similar_bugs", {
    "query_embedding": new_embedding,
    "pid": pid
}).execute()

    if not response.data:
        return None, new_doc_text
    outputs=[]
    for i in response.data:
        outputs.append(i)
    return outputs,new_doc_text

def generate_title(soft_prompt, new_document):
    soft_prompt_examples = '\n\n'.join(
        f'Component: {value[0]}\n Description: {value[1]}\n title: {key}' for key, value in soft_prompt.items()
    )

    input_prompt = f'''Generate a Bug report title based on description and Component. Do not generate anything else. Try to keep it in a limit of 30 characters.
    Look at the below examples to understand the task.
    {soft_prompt_examples}
    Now using the examples above, try giving the output for the following input enclosed within the | delimiter.
    | {new_document} |.
    Give the title as instructed above. Give the title only'''
    
    response = client.models.generate_content(model="gemini-2.0-flash", contents=input_prompt)
    return response.text

def suggest_title(component, description,pid):
    similar_docs, new_doc_text = retrieve_similar_documents(component,description,pid)
    
    examples={'''Concatenation of string variables slow compared to strings themselves''':['''JavaScript Engine''','''Ill be uploading a test case with various tests of string concatenation.  ; Mozilla (build 2000040308) shows good performance with all the ones that uses ; strings directly; e.g. string1 + string2.  its the last three it has ; problems with; they use string variables (e.g. var1 + var 2) in the ; concatenation.; ; try it out for yourselves.  all numberical values shown in the form fields is ; the execution time in millseconds.  the four tests on the left hand side; and ; the 2 at the top on the right hand side finished in around 1650ms on my P3/450. ;  this is just the same speed as Netscape Comm 4.72.  On the last three tests on ; the right hand side NC4.72 uses 7000ms; 10000ms and around 4500ms respectively; ; while Mozilla suddenly uses 10000ms; 14750ms and 5500ms on the same three tests. ;  Im slightly surprised by this sudden large increase in execution time.; ; the test results are very positive compared to IE5.01 though; except for the ; three tests with variables in them.  the 4 tests on the left hand side; from top ; to bottom; finish in around 5.5s; 9s; 12.5s and 16s in IE5.01.  in other words; ; a nearly linear increase in usage for each string that gets added.  the two top ; tests on the right hand side finish in around 9.3s and 20s; a _huge_ difference ; from both Mozilla and Communicator.  the last three tests; with variables; ; execute at just about the same speed as Communicator though (the last one ; actually about a second faster).'''],'''Linux/Slackware: undefined iostream symbols; app wont start''':['''HTML: Parser''','''johnny:~/mozilla/package# ./mozilla-apprunner.sh; MOZILLA_FIVE_HOME=/root/mozilla/package;   LD_LIBRARY_PATH=/root/mozilla/package:/usr/local/rvplayer5.0;       MOZ_PROGRAM=./apprunner;         moz_debug=0;      moz_debugger=; ./apprunner: error in loading shared libraries; /root/mozilla/package/libraptorhtmlpars.so: undefined symbol:; __vt_8iostream.3ios; ; I am running Slackware 4.0 and never have had any luck running any; of these milestone releases.  This was the M7 attempt.; Just thought you should know.; Thanks; Johnny O''']}
    
    soft_prompt = {i["title"]: [i["component"],i["description"]] for i in similar_docs if i["similarity"] > 0} if similar_docs else None
    if soft_prompt is None:
        soft_prompt = {}
    
    for k, v in examples.items():
        if len(soft_prompt) >= 3:
            break
        if k not in soft_prompt:
            soft_prompt[k] = v
    
    generated_title = generate_title(soft_prompt, new_doc_text)
    return f"{generated_title}"

def infer(component,title,description,pid=None,mode="priority"):
    if mode=="title":
        return suggest_title(component, description,pid)
    # BERT embedding
    combined_text = f"{component} [SEP] {title} [SEP] {description}"
    inputs = tokenizer(combined_text, return_tensors="pt", truncation=True,max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    cls_embedding = outputs.hidden_states[-1][:, 0, :].numpy()
    test_df = pd.DataFrame(cls_embedding)

    # Preprocessing
    test_pca = scaler.transform(test_df)
    test_pca = pca.transform(test_pca)
    test_df = pd.DataFrame(test_pca, columns=[f"PCA{i+1}" for i in range(75)], index=test_df.index)
    kmeans_labels_test = kmean.predict(test_df)
    test_df["kmeans_labels"]=kmeans_labels_test
    test_df["kmeans_labels"] = pd.Categorical(test_df["kmeans_labels"], categories=category_mappings["kmeans_labels"])
    

    # Predict
    prediction = xgb_model.predict(test_df,iteration_range=(0, 130))
    return f"Predicted Priority: {int(prediction[0])}"

# Gradio interface
iface = gr.Interface(
    fn=infer,
    inputs=[
        gr.Textbox(label="Component"),
        gr.Textbox(label="Title"),
        gr.Textbox(label="Description"),
        gr.Textbox(label="PID (optional)", value="default_pid"),  # Or Hidden
        gr.Radio(["priority", "title"], label="Mode", value="priority")
    ],
    outputs="text"
)
iface.launch()
