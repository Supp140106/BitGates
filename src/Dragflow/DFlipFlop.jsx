import { useEffect, useState, useRef } from 'react';
import {
    Handle,
    useNodeConnections,
    useNodesData,
    Position,
    useReactFlow,
} from '@xyflow/react';
import { getInputValue } from './utils';

export default function DFlipFlop({ id, data }) {
    const { updateNodeData } = useReactFlow();

    const dConn = useNodeConnections({ handleType: 'target', handleId: 'd' });
    const dNodeData = useNodesData(dConn?.[0]?.source);
    const dData = !!getInputValue(dConn, dNodeData) ? 1 : 0;

    const clkConn = useNodeConnections({ handleType: 'target', handleId: 'clk' });
    const clkNodeData = useNodesData(clkConn?.[0]?.source);
    const clkData = !!getInputValue(clkConn, clkNodeData) ? 1 : 0;

    const lastClk = useRef(0);
    const [q, setQ] = useState(0);

    useEffect(() => {
        const isPositiveEdge = lastClk.current === 0 && clkData === 1;
        if (isPositiveEdge) {
            setQ(dData);  // Capture D on rising clock edge
        }
        lastClk.current = clkData;
    }, [clkData, dData]);

    useEffect(() => {
        updateNodeData(id, (node) => ({
            ...node.data,
            value: q,
            q: q,
            notQ: q === 1 ? 0 : 1
        }));
    }, [q, id, updateNodeData]);

    return (
        <div className='h-20 w-16 bg-orange-100 border-2 border-orange-500 rounded relative flex items-center justify-center flex-col'>
            <span className="text-xs font-bold text-orange-700">D FF</span>

            <Handle type="target" position={Position.Left} isConnectable={dConn.length === 0} style={{ top: '35%' }} id="d" />
            <span className="absolute left-2 top-[28%] text-[10px] text-orange-800 pointer-events-none">D</span>

            <Handle type="target" position={Position.Left} isConnectable={clkConn.length === 0} style={{ top: '65%' }} id="clk" />
            <span className="absolute left-2 top-[58%] text-[8px] text-orange-800 pointer-events-none">CLK</span>

            <Handle type="source" position={Position.Right} isConnectable={true} style={{ top: '35%' }} id="q" />
            <span className="absolute right-1 top-[28%] text-[8px] font-bold text-orange-800 pointer-events-none flex items-center gap-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${q ? 'bg-green-500 shadow-[0_0_4px_#22c55e]' : 'bg-gray-400'}`} /> Q
            </span>

            <Handle type="source" position={Position.Right} isConnectable={true} style={{ top: '65%' }} id="notq" />
            <span className="absolute right-1 top-[58%] text-[8px] font-bold text-orange-800 pointer-events-none flex items-center gap-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${!q ? 'bg-green-500 shadow-[0_0_4px_#22c55e]' : 'bg-gray-400'}`} /> !Q
            </span>
        </div>
    );
}
