"use client";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import CreateProjectForm from "./CreateProjectForm";
import NewBugForm from "./NewBugForm";
import CenterProjectDescription from "./CenterProjectDescription";
import { useUser } from "../context/UserContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import SolutionForm from "./SolutionForm";

export default function CenterPage({ selectedProject, setSelectedProject }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [role, setRole] = useState(null);
    const user = useUser();


    const clearSelectedProject = () => {
        // console.log("Clearing selected project");
        localStorage.removeItem("selectedProject");
        setSelectedProject(null);
    };

    useEffect(() => {


        const fetchUserDetails = async () => {
            if (!user?.userId) {
                console.warn("No userId found, skipping role fetch.");
                return;
            }

            // console.log("Fetching role for userId:", user.userId);
            const supabase = createClientComponentClient();
            const { data, error } = await supabase
                .from("users")
                .select("role")
                .eq("id", user.userId)
                .single();

            console.log("data from context:", data);

            if (error) {
                console.error("Error fetching role:", error);
            } else {
                console.log("Fetched user role:", data.role);
                setRole(data.role);
            }
            // console.log("User from context:", user.json());
        };

        fetchUserDetails();
    }, [user]);

    // console.log("Current role:", role);
    // console.log("Modal open?", isModalOpen);
    // console.log("Selected project:", selectedProject);

    return (
        <div className="p-4 flex items-center justify-center relative w-full">
            {selectedProject ? (
                <div className="relative w-full flex justify-center">
                    <button
                        className="absolute top-4 right-4 text-[#F91E34]"
                        onClick={clearSelectedProject}
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <CenterProjectDescription selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
                </div>
            ) : (
                <button
                    onClick={() => {
                        console.log("Plus icon clicked");
                        setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center"
                >
                    <Plus className="w-12 h-12 text-[#F91E34]" />
                </button>
            )}

            {isModalOpen && role === "Tester" && (
                <>
                    {console.log("Rendering NewBugForm for tester")}
                    <NewBugForm setIsModalOpen={setIsModalOpen} />
                </>
            )}

            {isModalOpen && role === "Manager" && (
                <>
                    {console.log("Rendering CreateProjectForm for manager")}
                    <CreateProjectForm setIsModalOpen={setIsModalOpen} />
                </>
            )}

            {isModalOpen && role === "Developer" && (
                <>
                    {console.log("Rendering CreateProjectForm for manager")}
                    <SolutionForm />
                </>
            )}
        </div>
    );
}






// "use client";
// import { Plus, X } from "lucide-react";
// import { useEffect, useState } from "react";
// import CreateProjectForm from "./CreateProjectForm";
// import NewBugForm from "./NewBugForm";
// import CenterProjectDescription from "./CenterProjectDescription";
// import { useUser } from "../context/UserContext";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// export default function CenterPage({ selectedProject, setSelectedProject }) {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [role, setRole] = useState(null);
//     const user = useUser();


//     const clearSelectedProject = () => {
//         // console.log("Clearing selected project");
//         localStorage.removeItem("selectedProject");
//         setSelectedProject(null);
//     };

//     useEffect(() => {


//         const fetchUserDetails = async () => {
//             if (!user?.userId) {
//                 console.warn("No userId found, skipping role fetch.");
//                 return;
//             }

//             // console.log("Fetching role for userId:", user.userId);
//             const supabase = createClientComponentClient();
//             // const { data, error } = await supabase
//             //     .from("users")
//             //     .select("role")
//             //     .eq("id", user.userId)
//             //     .single();

//             const { data, error } = await supabase
//             .from("users")
//             .select()
//             .eq("id", user.userId)
//             // .single();

//             console.log("data from context:", data);

//             if (error) {
//                 console.error("Error fetching role:", error);
//             } else {
//                 console.log("Fetched user role:", data.role);
//                 setRole(data.role);
//             }
//             // console.log("User from context:", user.json());
//         };

//         fetchUserDetails();
//     }, [user]);

//     // console.log("Current role:", role);
//     // console.log("Modal open?", isModalOpen);
//     // console.log("Selected project:", selectedProject);

//     return (
//         <div className="p-4 flex items-center justify-center relative w-full">
//             {selectedProject ? (
//                 <div className="relative w-full flex justify-center">
//                     <button
//                         className="absolute top-4 right-4 text-gray-600"
//                         onClick={clearSelectedProject}
//                     >
//                         <X className="w-6 h-6" />
//                     </button>
//                     <CenterProjectDescription selectedProject={selectedProject} />
//                 </div>
//             ) : (
//                 <button
//                     onClick={() => {
//                         console.log("Plus icon clicked");
//                         setIsModalOpen(true);
//                     }}
//                     className="flex items-center justify-center"
//                 >
//                     <Plus className="w-12 h-12 text-gray-500" />
//                 </button>
//             )}

//             {isModalOpen && role === "Tester" && (
//                 <>
//                     {console.log("Rendering NewBugForm for tester")}
//                     <NewBugForm setIsModalOpen={setIsModalOpen} />
//                 </>
//             )}

//             {isModalOpen && role === "Manager" && (
//                 <>
//                     {console.log("Rendering CreateProjectForm for manager")}
//                     <CreateProjectForm setIsModalOpen={setIsModalOpen} />
//                 </>
//             )}
//         </div>
//     );
// }






// "use client";
// import { Plus, X } from "lucide-react";
// import { useEffect, useState } from "react";
// import CreateProjectForm from "./CreateProjectForm";
// import NewBugForm from "./NewBugForm";
// import CenterProjectDescription from "./CenterProjectDescription";
// import { useUser } from "../context/UserContext";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// export default function CenterPage({ selectedProject, setSelectedProject }) {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [role, setRole] = useState(null);
//     const user = useUser();


//     const clearSelectedProject = () => {
//         // console.log("Clearing selected project");
//         localStorage.removeItem("selectedProject");
//         setSelectedProject(null);
//     };

//     useEffect(() => {


//         const fetchUserDetails = async () => {
//             if (!user?.userId) {
//                 console.warn("No userId found, skipping role fetch.");
//                 return;
//             }

//             // console.log("Fetching role for userId:", user.userId);
//             const supabase = createClientComponentClient();
//             // const { data, error } = await supabase
//             //     .from("users")
//             //     .select("role")
//             //     .eq("id", user.userId)
//             //     .single();

//             const { data, error } = await supabase
//             .from("users")
//             .select()
//             .eq("id", user.userId)
//             // .single();

//             console.log("data from context:", data);

//             if (error) {
//                 console.error("Error fetching role:", error);
//             } else {
//                 console.log("Fetched user role:", data.role);
//                 setRole(data.role);
//             }
//             // console.log("User from context:", user.json());
//         };

//         fetchUserDetails();
//     }, [user]);

//     // console.log("Current role:", role);
//     // console.log("Modal open?", isModalOpen);
//     // console.log("Selected project:", selectedProject);

//     return (
//         <div className="p-4 flex items-center justify-center relative w-full">
//             {selectedProject ? (
//                 <div className="relative w-full flex justify-center">
//                     <button
//                         className="absolute top-4 right-4 text-gray-600"
//                         onClick={clearSelectedProject}
//                     >
//                         <X className="w-6 h-6" />
//                     </button>
//                     <CenterProjectDescription selectedProject={selectedProject} />
//                 </div>
//             ) : (
//                 <button
//                     onClick={() => {
//                         console.log("Plus icon clicked");
//                         setIsModalOpen(true);
//                     }}
//                     className="flex items-center justify-center"
//                 >
//                     <Plus className="w-12 h-12 text-gray-500" />
//                 </button>
//             )}

//             {isModalOpen && role === "Tester" && (
//                 <>
//                     {console.log("Rendering NewBugForm for tester")}
//                     <NewBugForm setIsModalOpen={setIsModalOpen} />
//                 </>
//             )}

//             {isModalOpen && role === "Manager" && (
//                 <>
//                     {console.log("Rendering CreateProjectForm for manager")}
//                     <CreateProjectForm setIsModalOpen={setIsModalOpen} />
//                 </>
//             )}
//         </div>
//     );
// }
