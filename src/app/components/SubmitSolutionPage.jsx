import { useState } from "react";
import SolutionForm from "@/components/SolutionForm";

export default function SubmitSolutionPage() {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="p-10">
            <button
                onClick={() => setShowForm(true)}
                className="bg-[#F91E34] text-black px-4 py-2 rounded-lg"
            >
                Open Solution Form
            </button>

            {showForm && (
                <SolutionForm
                    bugName="Crash on Dashboard Load"
                    onClose={() => setShowForm(false)}
                />
            )}
        </div>
    );
}
