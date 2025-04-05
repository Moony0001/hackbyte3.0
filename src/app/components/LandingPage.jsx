"use client";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import CenterPage from "./CenterPart";
import { Menu } from "lucide-react";

export default function LandingPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedProject = localStorage.getItem("selectedProject");
    if (storedProject) {
      setSelectedProject(JSON.parse(storedProject));
    }
  }, []);

  useEffect(() => {
    if (selectedProject) {
      localStorage.setItem("selectedProject", JSON.stringify(selectedProject));
    }
  }, [selectedProject]);

  return (
    <div className="min-h-screen">
      <div className="absolute top-35 left-4 md:hidden z-9">
        <button onClick={() => setSidebarOpen(true)}>
          <Menu className="w-8 h-8 text-gray-800" />
        </button>
      </div>

      <div className="flex min-h-screen">
        <Sidebar
          setSelectedProject={setSelectedProject}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <CenterPage 
          selectedProject={selectedProject} 
          setSelectedProject={setSelectedProject} 
        />
      </div>
    </div>
  );
}
