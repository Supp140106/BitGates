import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useDnD } from "../Dragflow/DnDContext";

export default function Flipflops() {
    const [_, setType] = useDnD();
    const [open, setOpen] = useState(false);

    const onDragStart = (event, nodeType) => {
        setType(nodeType);
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = "move";

        const dragImg = event.currentTarget.querySelector('div.h-6');
        if (dragImg) {
            event.dataTransfer.setDragImage(dragImg, 12, 12);
        }
    };

    return (
        <div className="w-full">
            <div
                className="w-full bg-orange-500 text-white flex items-center justify-between px-4 py-2 rounded-md shadow hover:bg-orange-600 transition-colors duration-300 cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
            >
                <span className="text-lg font-semibold">Flip-flops</span>
                <ChevronDown
                    className={`w-5 h-5 transform transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"
                        }`}
                />
            </div>

            {open && (
                <div className="w-full bg-orange-50 px-4 py-3 rounded-md shadow-inner space-y-3 mt-2">
                    {/* SR Flip-flop */}
                    <div
                        className="flex items-center justify-start gap-3 p-2 border border-orange-500 rounded bg-white hover:bg-gray-100 cursor-move"
                        onDragStart={(e) => onDragStart(e, "srflipflop")}
                        draggable
                    >
                        <div className="h-6 w-6 bg-orange-200 border border-orange-500 flex items-center justify-center font-bold text-[8px] text-orange-700">SR</div>
                        <span className="text-sm font-medium text-gray-800">SR Flip-flop</span>
                    </div>

                    {/* JK Flip-flop */}
                    <div
                        className="flex items-center justify-start gap-3 p-2 border border-orange-500 rounded bg-white hover:bg-gray-100 cursor-move"
                        onDragStart={(e) => onDragStart(e, "jkflipflop")}
                        draggable
                    >
                        <div className="h-6 w-6 bg-orange-200 border border-orange-500 flex items-center justify-center font-bold text-[8px] text-orange-700">JK</div>
                        <span className="text-sm font-medium text-gray-800">JK Flip-flop</span>
                    </div>

                    {/* D Flip-flop */}
                    <div
                        className="flex items-center justify-start gap-3 p-2 border border-orange-500 rounded bg-white hover:bg-gray-100 cursor-move"
                        onDragStart={(e) => onDragStart(e, "dflipflop")}
                        draggable
                    >
                        <div className="h-6 w-6 bg-orange-200 border border-orange-500 flex items-center justify-center font-bold text-[8px] text-orange-700">D</div>
                        <span className="text-sm font-medium text-gray-800">D Flip-flop</span>
                    </div>

                    {/* T Flip-flop */}
                    <div
                        className="flex items-center justify-start gap-3 p-2 border border-orange-500 rounded bg-white hover:bg-gray-100 cursor-move"
                        onDragStart={(e) => onDragStart(e, "tflipflop")}
                        draggable
                    >
                        <div className="h-6 w-6 bg-orange-200 border border-orange-500 flex items-center justify-center font-bold text-[8px] text-orange-700">T</div>
                        <span className="text-sm font-medium text-gray-800">T Flip-flop</span>
                    </div>
                </div>
            )}
        </div>
    );
}
