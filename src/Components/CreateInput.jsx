import React, { useState } from "react";

export default function CreateProjectInput() {
  const [projectName, setProjectName] = useState("");

  const handleCreate = () => {
    if (projectName.trim() === "") return;
    console.log("Create project:", projectName);
    setProjectName(""); // Reset input after creation
  };

  return (
    <div className="flex items-center space-x-2 p-4 bg-white shadow-md rounded-xl w-full max-w-md mx-auto my-6">
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="Enter project name"
        className="flex-grow p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
      <button
        onClick={handleCreate}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Create
      </button>
    </div>
  );
}
