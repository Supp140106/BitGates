import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useDnD } from "../Dragflow/DnDContext";
import ANDGate from "../assets/images/and.png";
import ORGate from "../assets/images/or.png";
import NOTGate from "../assets/images/notgate.png";
import NORGate from "../assets/images/nor.png";
import NANDGate from "../assets/images/nand.webp";
import XORGate from "../assets/images/xor.png";
import XNORGate from "../assets/images/xnor.png";

export default function Gates() {
  const [_, setType] = useDnD();
  const [open, setOpen] = useState(false);

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-full">
      <div
        className="w-full bg-purple-500 text-amber-50 flex items-center justify-between px-4 py-2 rounded-md shadow hover:bg-purple-600 transition-colors duration-300 cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-lg font-semibold">Logic Gates</span>
        <ChevronDown
          className={`w-5 h-5 transform transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {open && (
        <div className="w-full bg-purple-100 px-4 py-3 rounded-md shadow-inner space-y-3 mt-2">
          {/* OR Gate */}
          <div
            className="flex items-center justify-start gap-3 p-2 border border-amber-500 rounded bg-white hover:bg-gray-100 cursor-move"
            onDragStart={(e) => onDragStart(e, "orgate")}
            draggable
          >
            <img src={ORGate} className="h-7 w-7" alt="OR Gate" />
            <span className="text-sm font-medium text-gray-800">OR Gate</span>
          </div>

          {/* AND Gate */}
          <div
            className="flex items-center justify-start gap-3 p-2 border border-amber-500 rounded bg-white hover:bg-gray-100 cursor-move"
            onDragStart={(e) => onDragStart(e, "andgate")}
            draggable
          >
            <img src={ANDGate} className="h-7 w-7" alt="AND Gate" />
            <span className="text-sm font-medium text-gray-800">AND Gate</span>
          </div>

          {/* NOT Gate */}
          <div
            className="flex items-center justify-start gap-3 p-2 border border-amber-500 rounded bg-white hover:bg-gray-100 cursor-move"
            onDragStart={(e) => onDragStart(e, "notgate")}
            draggable
          >
            <img src={NOTGate} className="h-7 w-7" alt="NOT Gate" />
            <span className="text-sm font-medium text-gray-800">NOT Gate</span>
          </div>

          <div
            className="flex items-center justify-start gap-3 p-2 border border-amber-500 rounded bg-white hover:bg-gray-100 cursor-move"
            onDragStart={(e) => onDragStart(e, "norgate")}
            draggable
          >
            <img src={NORGate} className="h-7 w-7" alt="NOT Gate" />
            <span className="text-sm font-medium text-gray-800">NOR Gate</span>
          </div>


          <div
            className="flex items-center justify-start gap-3 p-2 border border-amber-500 rounded bg-white hover:bg-gray-100 cursor-move"
            onDragStart={(e) => onDragStart(e, "nandgate")}
            draggable
          >
            <img src={NANDGate} className="h-7 w-7" alt="NAND Gate" />
            <span className="text-sm font-medium text-gray-800">NAND Gate</span>
          </div>

          <div
            className="flex items-center justify-start gap-3 p-2 border border-amber-500 rounded bg-white hover:bg-gray-100 cursor-move"
            onDragStart={(e) => onDragStart(e, "xorgate")}
            draggable
          >
            <img src={XORGate} className="h-7 w-7" alt="XOR Gate" />
            <span className="text-sm font-medium text-gray-800">XOR Gate</span>
          </div>


          <div
            className="flex items-center justify-start gap-3 p-2 border border-amber-500 rounded bg-white hover:bg-gray-100 cursor-move"
            onDragStart={(e) => onDragStart(e, "xorgate")}
            draggable
          >
            <img src={XNORGate} className="h-7 w-7" alt="XOR Gate" />
            <span className="text-sm font-medium text-gray-800">XNOR Gate</span>
          </div>
        </div>
      )}
    </div>
  );
}
