import { useState, useCallback, useEffect } from "react"; // Import useEffect
import { Handle, Position, useReactFlow } from '@xyflow/react';

export default function BitInput({ id, data }) { // Add data prop
  const [isYes, setIsYes] = useState(data?.value !== undefined ? data.value : true); // Initialize from data or default
  const { updateNodeData } = useReactFlow();

  // Update node data on initial mount or if id/data changes
  useEffect(() => {
    updateNodeData(id, { value: isYes });
  }, []); // Depend on isYes to update if initial state changes

  const toggleBit = useCallback(() => {
    const newValue = !isYes;
    setIsYes(newValue);
    updateNodeData(id, { value: newValue });
  }, [isYes, id, updateNodeData]);

  return (
    <div>
      <div className="h-7 w-14 flex items-center justify-center">
        <button
          onClick={toggleBit}
          className={`w-full h-full rounded-full transition-colors duration-300
            ${isYes ? "bg-green-500" : "bg-red-500"} text-white text-sm font-semibold`}
        >
          {isYes ? "1" : "0"}
        </button>
      </div>
      <Handle type="source" position={Position.Right} isConnectable={true} />
    </div>
  );
}