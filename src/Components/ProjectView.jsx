import React, { useState } from "react";
import { Trash2, FolderOpen, Sparkles } from "lucide-react";
import { Showall } from "../Database/setup";

const initialProjects =async()=>{
    const l = await Showall()
    return l
}

export default function ProjectView() {
  const [projects, setProjects] = useState(initialProjects);
  const [hoveredProject, setHoveredProject] = useState(null);

  const handleDelete = (id) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "In Progress": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Completed": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-gradient-to-r from-blue-500 to-purple-600";
    if (progress >= 75) return "bg-gradient-to-r from-emerald-500 to-teal-600";
    if (progress >= 50) return "bg-gradient-to-r from-amber-500 to-orange-600";
    return "bg-gradient-to-r from-rose-500 to-pink-600";
  };

  return (
    <div className="h-fit bg-white">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-200/20 to-rose-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">


        {/* Main Container */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-purple-900 px-8 py-6">
            <div className="grid grid-cols-2 gap-4 text-white font-semibold text-lg">
              <div>Project Name</div>
              <div className="text-center">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-200/50">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`grid grid-cols-2 gap-4 p-8 transition-all duration-500 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transform hover:scale-[1.02] ${
                  hoveredProject === project.id ? 'shadow-xl' : ''
                }`}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Project Name */}
                <div className="flex items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 leading-tight">{project.name}</h3>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center items-center">
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 hover:from-rose-600 hover:to-pink-700"
                  >
                    <Trash2 className="w-4 h-4 group-hover:animate-bounce" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {projects.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full mb-6">
                <FolderOpen className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-700 mb-2">No Projects Found</h3>
              <p className="text-slate-500">Your creative journey awaits!</p>
            </div>
          )}
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}