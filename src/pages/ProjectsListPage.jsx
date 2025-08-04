import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Plus, FolderOpen, Trash2, FileText } from 'lucide-react';

export default function ProjectsListPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projects = await invoke('get_all_projects');
        setProjects(projects);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const handleDeleteProject = async (projectId, projectName) => {
    if (confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
      try {
        await invoke('delete_project', { id: projectId });
        // Refresh the projects list
        const updatedProjects = await invoke('get_all_projects');
        setProjects(updatedProjects);
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <FolderOpen className="mr-3 h-8 w-8 text-blue-600" />
              BitGates Projects
            </h1>
            <p className="mt-2 text-gray-600">Create and manage your digital logic workflows</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Project Button */}
        <div className="mb-8">
          <Link
            to="/create"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create New Project
          </Link>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first digital logic project</p>
            <Link
              to="/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden group"
              >
                {/* Project Card Content */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                    {project.project_name}
                  </h3>
                  
                  <p className="text-sm text-gray-500 mb-4">
                    Digital Logic Project
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Click to open
                    </span>
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-gray-400">Ready</span>
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                  <button
                    className="w-full flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id, project.project_name);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}