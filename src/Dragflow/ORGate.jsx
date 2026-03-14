import { useEffect, useCallback } from 'react';
import {

  Handle,
  useNodeConnections,
  useNodesData,
  Position,
  useReactFlow,
} from '@xyflow/react';
import { getInputValue } from './utils';

import orgate from '../assets/images/or.png'; // make sure this path is correct

export default function ORGate({ id, data }) {
  const { updateNodeData } = useReactFlow();

  // Get left input connection (handle "a")
  const l = useNodeConnections({
    handleType: 'target',
    handleId: 'a',
  });
  const lNodeData = useNodesData(l?.[0]?.source);

  // Get right input connection (handle "b")
  const r = useNodeConnections({
    handleType: 'target',
    handleId: 'b',
  });
  const rNodeData = useNodesData(r?.[0]?.source);

  // Compute OR logic output
  const inputL = getInputValue(l, lNodeData);
  const inputR = getInputValue(r, rNodeData);
  const result = inputL || inputR;

  // 🔁 Update node data with computed output
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
    <div className="w-7 h-7">
      <img src={orgate} className="h-7 w-7 mb-2" alt="OR Gate" />

      <Handle
        type="target"
        position={Position.Left}
        isConnectable={l.length == 0}
        style={{ top: '15px' }}
        id="a"
      />
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={r.length == 0}
        style={{ top: '35px' }}
        id="b"
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
