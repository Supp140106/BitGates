import { useEffect } from 'react';
import {

    Handle,
    useNodeConnections,
    useNodesData,
    Position,
    useReactFlow,
} from '@xyflow/react';
import { getInputValue } from './utils';

export default function MUX41Gate({ id, data }) {
    const { updateNodeData } = useReactFlow();

    // Data inputs
    const d0Conn = useNodeConnections({ handleType: 'target', handleId: 'd0' });
    const d0NodeData = useNodesData(d0Conn?.[0]?.source);
    const d0Data = getInputValue(d0Conn, d0NodeData);

    const d1Conn = useNodeConnections({ handleType: 'target', handleId: 'd1' });
    const d1NodeData = useNodesData(d1Conn?.[0]?.source);
    const d1Data = getInputValue(d1Conn, d1NodeData);

    const d2Conn = useNodeConnections({ handleType: 'target', handleId: 'd2' });
    const d2NodeData = useNodesData(d2Conn?.[0]?.source);
    const d2Data = getInputValue(d2Conn, d2NodeData);

    const d3Conn = useNodeConnections({ handleType: 'target', handleId: 'd3' });
    const d3NodeData = useNodesData(d3Conn?.[0]?.source);
    const d3Data = getInputValue(d3Conn, d3NodeData);

    // Select inputs
    const s0Conn = useNodeConnections({ handleType: 'target', handleId: 's0' });
    const s0NodeData = useNodesData(s0Conn?.[0]?.source);
    const s0Data = getInputValue(s0Conn, s0NodeData);

    const s1Conn = useNodeConnections({ handleType: 'target', handleId: 's1' });
    const s1NodeData = useNodesData(s1Conn?.[0]?.source);
    const s1Data = getInputValue(s1Conn, s1NodeData);

    // Logic: output = D[S]
    const selectVal = (s1Data ? 2 : 0) + (s0Data ? 1 : 0);
    let result = 0;
    if (selectVal === 0) result = d0Data;
    else if (selectVal === 1) result = d1Data;
    else if (selectVal === 2) result = d2Data;
    else if (selectVal === 3) result = d3Data;

    useEffect(() => {
        updateNodeData(id, (node) => ({
            ...node.data,
            value: !!result,
        }));
    }, [result, id, updateNodeData]);

    return (
        <div className='h-24 w-12 bg-purple-200 border-2 border-purple-500 rounded relative flex items-center justify-center flex-col'>
            <span className="text-xs font-bold text-purple-700">MUX</span>
            <span className="text-[10px] text-purple-600">4:1</span>

            {/* D0 Input */}
            <Handle type="target" position={Position.Left} isConnectable={d0Conn.length == 0} style={{ top: '20%' }} id="d0" />
            {/* D1 Input */}
            <Handle type="target" position={Position.Left} isConnectable={d1Conn.length == 0} style={{ top: '40%' }} id="d1" />
            {/* D2 Input */}
            <Handle type="target" position={Position.Left} isConnectable={d2Conn.length == 0} style={{ top: '60%' }} id="d2" />
            {/* D3 Input */}
            <Handle type="target" position={Position.Left} isConnectable={d3Conn.length == 0} style={{ top: '80%' }} id="d3" />

            {/* Select Inputs (S1, S0) - Bottom */}
            <Handle type="target" position={Position.Bottom} isConnectable={s1Conn.length == 0} style={{ left: '30%' }} id="s1" />
            <span className="absolute bottom-1 left-2 text-[8px] text-purple-800 pointer-events-none">S1</span>
            <Handle type="target" position={Position.Bottom} isConnectable={s0Conn.length == 0} style={{ left: '70%' }} id="s0" />
            <span className="absolute bottom-1 right-2 text-[8px] text-purple-800 pointer-events-none">S0</span>

            {/* Output (Y) */}
            <Handle type="source" position={Position.Right} isConnectable={true} id="y" />
        </div>
    );
}
