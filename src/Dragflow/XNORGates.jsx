import { useEffect, useCallback } from 'react';
import {
  Handle,
  useNodeConnections,
  useNodesData,
  Position,
  useReactFlow,
} from '@xyflow/react';

import nandgate from '../assets/images/xnor.png';

export default function XNORGate({ id, data }) {
  const { updateNodeData } = useReactFlow();

  // Get left input connection (handle "a")
  const l = useNodeConnections({ handleType: 'target', handleId: 'a' });
  const lNodeData = useNodesData(l?.[0]?.source);

  // Get right input connection (handle "b")
  const r = useNodeConnections({ handleType: 'target', handleId: 'b' });
  const rNodeData = useNodesData(r?.[0]?.source);

  const inputL = lNodeData?.data?.value ?? 0;
  const inputR = rNodeData?.data?.value ?? 0;
  const result = (inputL == inputR);


  useEffect(() => {
    updateNodeData(id, (node) => ({
      ...node.data,
      value: result,
    }));
  }, [result, id, updateNodeData]);

  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);
  console.log(l)
  return (
    <div className='h-7 w-7'>
      <img src={nandgate} className="h-7 w-7 mb-2" alt="AND Gate" />

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
        isValidConnection={()=>{ 
          return !(r.length>0)}}
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
