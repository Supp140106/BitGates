import { useEffect, useCallback } from 'react';
import {
  Handle,
  useNodeConnections,
  useNodesData,
  Position,
  useReactFlow,
} from '@xyflow/react';

import notgate from '../assets/images/notgate.png';

export default function NOTGate({ id, data }) {
  const { updateNodeData } = useReactFlow();

  // Get input connection (handle "a")
  const inputConn = useNodeConnections({ handleType: 'target', handleId: 'a' });
  const inputNodeData = useNodesData(inputConn?.[0]?.source);

  const input = inputNodeData?.data?.value ?? 0;
  const result = input ? 0 : 1;

  useEffect(() => {
    updateNodeData(id, (node) => ({
      ...node.data,
      value: result,
    }));
  }, [result, id, updateNodeData]);

  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="h-7 w-7">
      <img src={notgate} className="h-7 w-7 mb-2" alt="NOT Gate" />

      <Handle
        type="target"
        position={Position.Left}
        isConnectable={inputConn.length == 0}
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
