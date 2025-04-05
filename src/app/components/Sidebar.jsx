"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Card from "./Card";
import { useUser } from "../context/UserContext";

export default function Sidebar({ setSelectedProject, sidebarOpen, setSidebarOpen }) {
    const [projects, setProjects] = useState([]);
    const user = useUser();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch(`/api/project/all?userId=${user.userId}`);
                const data = await res.json();
    
                console.log("Fetched projects for user:", user);
                console.log("Fetched projects data:", data);
    
                if (res.ok) {
                    setProjects(data.projects);
                } else {
                    console.error("Error fetching projects:", data.error);
                }
            } catch (err) {
                console.error("Error fetching projects:", err);
            }
        };
    
        if (user) {
            fetchProjects();
        }
    }, [user]);
    

    return (
        <div className="z-999">
            {/* Desktop Sidebar */}
            <div className="hidden md:block p-4 mt-30">
                <h1 className="font-bold text-lg mb-4">Your Projects</h1>
    
                {!projects? (
                    <p className="text-gray-500">No projects found.</p>
                ) : (
                    projects.map((project) => (
                        <button
                            key={project.id}
                            className="w-full text-left"
                            onClick={() => setSelectedProject(project)}
                        >
                            <Card>
                                <div>
                                    <h3 className="font-semibold">Project: {project.name}</h3>
                                    <h5>Tester: {project.tester || "N/A"}</h5>
                                    <h5>Developer: {project.developer || "N/A"}</h5>
                                </div>
                            </Card>
                        </button>
                    ))
                )}
            </div>
    
            {/* Mobile Sidebar */}
            <div
                className={`fixed top-26 left-0 h-full w-[40%] bg-white p-4 shadow-lg transition-transform duration-300 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:hidden`}
                style={{ zIndex: 50 }}
            >
                <button
                    className="absolute top-4 right-4 text-gray-600"
                    onClick={() => setSidebarOpen(false)}
                >
                    <X className="w-6 h-6" />
                </button>
    
                <h1 className="font-bold text-lg mb-4">Your Projects</h1>
    
                {!projects ? (
                    <p className="text-gray-500">No projects found.</p>
                ) : (
                    projects.map((project) => (
                        <button
                            key={project.id}
                            className="w-full text-left"
                            onClick={() => {
                                setSelectedProject(project);
                                setSidebarOpen(false);
                            }}
                        >
                            <Card>
                                <div>
                                    <h3 className="font-semibold">Project: {project.name}</h3>
                                    <h5>Tester: {project.tester || "N/A"}</h5>
                                    <h5>Developer: {project.developer || "N/A"}</h5>
                                </div>
                            </Card>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
      
}






// "use client";
// import { useEffect, useState } from "react";
// import { X } from "lucide-react";
// import Card from "./Card";
// import { useUser } from "../context/UserContext";

// export default function Sidebar({ setSelectedProject, sidebarOpen, setSidebarOpen }) {
//     const [projects, setProjects] = useState([]);

//     const user = useUser();

//     useEffect(() => {
//         const fetchProjects = async () => {
//             try {
//                 const res = await fetch("/api/project/all");
//                 const data = await res.json();

//                 console.log("user in projects:", user);

//                 if (res.ok) {
//                     setProjects(data.projects);
//                 } else {
//                     console.error("Error fetching projects:", data.error);
//                 }
//             } catch (err) {
//                 console.error("Error fetching projects:", err);
//             }
//         };

//         if (user) {
//             fetchProjects();
//         }
//     }, [user]);

//     return (
//         <div className="z-999">
//             <div className="hidden md:block p-4 mt-30">
//                 <h1 className="font-bold text-lg mb-4">Your Projects</h1>
//                 {projects.map((project) => (
//                     <button
//                         key={project.id}
//                         className="w-full text-left"
//                         onClick={() => setSelectedProject(project)}
//                     >
//                         <Card>
//                             <div>
//                                 <h3 className="font-semibold">Project: {project.name}</h3>
//                                 <h5>Manager: {project.manager}</h5>
//                                 <h5>Your Role: {project.role}</h5>
//                                 <h5>Bugs: {project.bugCount}</h5>
//                             </div>
//                         </Card>
//                     </button>
//                 ))}
//             </div>

//             <div
//                 className={`fixed top-26 left-0 h-full w-[40%] bg-white p-4 shadow-lg transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
//                 style={{ zIndex: 50 }}
//             >
//                 <button
//                     className="absolute top-4 right-4 text-gray-600"
//                     onClick={() => setSidebarOpen(false)}
//                 >
//                     <X className="w-6 h-6" />
//                 </button>

//                 <h1 className="font-bold text-lg mb-4">Your Projects</h1>

//                 {projects.map((project) => (
//                     <button
//                         key={project.id}
//                         className="w-full text-left"
//                         onClick={() => {
//                             setSelectedProject(project);
//                             setSidebarOpen(false);
//                         }}
//                     >
//                         <Card>
//                             <div>
//                                 <h3 className="font-semibold">Project: {project.name}</h3>
//                                 <h5>Manager: {project.manager}</h5>
//                                 <h5>Your Role: {project.role}</h5>
//                                 <h5>Bugs: {project.bugCount}</h5>
//                             </div>
//                         </Card>
//                     </button>
//                 ))}
//             </div>
//         </div>
//     );
// }
