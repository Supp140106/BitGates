import { ChevronDown, Clock } from "lucide-react";
import { useState } from "react";
import { useDnD } from "../Dragflow/DnDContext";

export default function Input() {
  const [_, setType] = useDnD();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(1); // allows toggling between 1 and 0

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = "move";

    const dragImg = event.currentTarget.querySelector('button') || event.currentTarget.querySelector('div');
    if (dragImg) {
      event.dataTransfer.setDragImage(dragImg, 20, 20);
    }
  };

  return (
    <div className="w-full">
      {/* Toggle Header */}
      <div
        className="w-full bg-sky-500 text-white flex items-center justify-between px-4 py-2 rounded-b-md shadow-md hover:bg-sky-600 transition-all duration-300 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-lg font-semibold tracking-wide">Input</span>
        <ChevronDown
          className={`w-5 h-5 transform transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"
            }`}
        />
      </div>

      {/* Dropdown Content */}
      {open && (
        <div className="mt-3 w-full bg-white border border-sky-300 rounded-xl p-4 shadow-inner transition-all duration-300 space-y-3">
          {/* Draggable Bit Input */}
          <div
            className="flex items-center justify-between gap-4"
            onDragStart={(e) => onDragStart(e, "bitinput")}
            draggable
          >
            <button
              onClick={() => setValue((prev) => (prev === 1 ? 0 : 1))}
              className={`w-20 py-2 rounded-full text-white text-sm font-semibold shadow transition-colors duration-300 
                ${value === 1 ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}
            >
              {value}
            </button>
            <span className="text-sky-700 text-base font-medium">Bit Input</span>
          </div>

          {/* Clock Node */}
          <div
            className="flex items-center justify-between gap-4 p-2 border border-sky-200 rounded-lg hover:bg-sky-50 transition-colors duration-200 cursor-move"
            onDragStart={(e) => onDragStart(e, "clocknode")}
            draggable
          >
            <div className="bg-sky-500 p-2 rounded-lg shadow-sm">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <span className="text-sky-700 text-base font-medium">Clock (1s)</span>
          </div>
        </div>
      )}
    </div>
  );
}
