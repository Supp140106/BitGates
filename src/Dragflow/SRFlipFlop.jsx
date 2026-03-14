import { useEffect, useState, useRef } from 'react';
import {
    Handle,
    useNodeConnections,
    useNodesData,
    Position,
    useReactFlow,
} from '@xyflow/react';
import { getInputValue } from './utils';

export default function SRFlipFlop({ id, data }) {
    const { updateNodeData } = useReactFlow();

    const sConn = useNodeConnections({ handleType: 'target', handleId: 's' });
    const sNodeData = useNodesData(sConn?.[0]?.source);
    const sRaw = getInputValue(sConn, sNodeData);
    const sData = !!sRaw ? 1 : 0;

    const rConn = useNodeConnections({ handleType: 'target', handleId: 'r' });
    const rNodeData = useNodesData(rConn?.[0]?.source);
    const rRaw = getInputValue(rConn, rNodeData);
    const rData = !!rRaw ? 1 : 0;

    const clkConn = useNodeConnections({ handleType: 'target', handleId: 'clk' });
    const clkNodeData = useNodesData(clkConn?.[0]?.source);
    const clkRaw = getInputValue(clkConn, clkNodeData);
    const clkData = !!clkRaw ? 1 : 0;

    const lastClk = useRef(0);
    const [q, setQ] = useState(0);

    useEffect(() => {
        const isPositiveEdge = lastClk.current === 0 && clkData === 1;

        if (isPositiveEdge) {
            if (sData === 1 && rData === 0) {
                setQ(1);
            } else if (sData === 0 && rData === 1) {
                setQ(0);
            }
            // S=1,R=1 → invalid, keep previous state (no-op)
            // S=0,R=0 → no change
        }
        lastClk.current = clkData;
    }, [clkData, sData, rData]);

    useEffect(() => {
        updateNodeData(id, (node) => ({
            ...node.data,
            value: q,
            q: q,
            notQ: q === 1 ? 0 : 1
        }));
    }, [q, id, updateNodeData]);

    return (
        <div className='h-24 w-16 bg-orange-100 border-2 border-orange-500 rounded relative flex items-center justify-center flex-col'>
            <span className="text-xs font-bold text-orange-700">SR FF</span>

            <Handle type="target" position={Position.Left} isConnectable={sConn.length === 0} style={{ top: '25%' }} id="s" />
            <span className="absolute left-2 top-[18%] text-[8px] text-orange-800 pointer-events-none">S</span>

            <Handle type="target" position={Position.Left} isConnectable={rConn.length === 0} style={{ top: '50%' }} id="r" />
            <span className="absolute left-2 top-[43%] text-[8px] text-orange-800 pointer-events-none">R</span>

            <Handle type="target" position={Position.Left} isConnectable={clkConn.length === 0} style={{ top: '75%' }} id="clk" />
            <span className="absolute left-2 top-[68%] text-[8px] text-orange-800 pointer-events-none">CLK</span>

            <Handle type="source" position={Position.Right} isConnectable={true} style={{ top: '30%' }} id="q" />
            <span className="absolute right-1 top-[22%] text-[8px] font-bold text-orange-800 pointer-events-none flex items-center gap-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${q ? 'bg-green-500 shadow-[0_0_4px_#22c55e]' : 'bg-gray-400'}`} /> Q
            </span>

            <Handle type="source" position={Position.Right} isConnectable={true} style={{ top: '70%' }} id="notq" />
            <span className="absolute right-1 top-[62%] text-[8px] font-bold text-orange-800 pointer-events-none flex items-center gap-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${!q ? 'bg-green-500 shadow-[0_0_4px_#22c55e]' : 'bg-gray-400'}`} /> !Q
            </span>
        </div>
    );
}
