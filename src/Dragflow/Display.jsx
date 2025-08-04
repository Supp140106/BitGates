import { useEffect } from "react";
import {
  Handle,
  Position,
  useNodeConnections,
  useNodesData,
  useReactFlow,
} from "@xyflow/react";

export default function BitDisplay({ id, data }) {
  const { updateNodeData } = useReactFlow();
  const redConnections = useNodeConnections({
    handleType: "target",
    handleId: "a",
  });

  const redNodeData = useNodesData(redConnections?.[0]?.source);

  const value = redNodeData?.data?.value ?? 0;

  useEffect(() => {
    updateNodeData(id, (node) => ({
      ...node.data,
      value: value,
    }));
  }, [value, id, updateNodeData]);

  return (
    <div className="">
      <div className="h-6 w-14 flex items-center justify-center mb-1">
        <div
          className={`w-full h-full rounded-full transition-colors duration-300 flex items-center justify-center
            ${value ? "bg-green-500" : "bg-red-500"} text-white text-sm font-semibold`}
        >
          {value ? "1" : "0"}
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={redConnections.length == 0}
        id="a"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={true}
        id="c"
      />
    </div>
  );
}
