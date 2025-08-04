import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useDnD } from "../Dragflow/DnDContext";

export default function Output() {
  const [_, setType] = useDnD();
  const [open, setOpen] = useState(false);

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-full">
      <div
        className="w-full bg-emerald-500 text-white flex items-center justify-between px-4 py-2 rounded-md shadow hover:bg-emerald-600 transition-colors duration-300 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-lg font-semibold">Output</span>
        <ChevronDown
          className={`w-5 h-5 transform transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {open && (
        <div className="w-full bg-emerald-100 px-4 py-3 rounded-md shadow-inner mt-2">
          <div
            className="flex items-center gap-3 border border-amber-500 p-2 bg-white rounded hover:bg-gray-100 cursor-move"
            onDragStart={(event) => onDragStart(event, "bitdisplay")}
            draggable
          >
            <div className="w-4 h-4 bg-emerald-500 rounded-full" />
            <span className="text-sm font-medium text-gray-800">Output Node</span>
          </div>
        </div>
      )}
    </div>
  );
}
