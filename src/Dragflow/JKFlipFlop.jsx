import { useEffect, useState, useRef } from 'react';
import {
    Handle,
    useNodeConnections,
    useNodesData,
    Position,
    useReactFlow,
} from '@xyflow/react';
import { getInputValue } from './utils';

export default function JKFlipFlop({ id, data }) {
    const { updateNodeData } = useReactFlow();

    const jConn = useNodeConnections({ handleType: 'target', handleId: 'j' });
    const jNodeData = useNodesData(jConn?.[0]?.source);
    const jData = !!getInputValue(jConn, jNodeData) ? 1 : 0;

    const kConn = useNodeConnections({ handleType: 'target', handleId: 'k' });
    const kNodeData = useNodesData(kConn?.[0]?.source);
    const kData = !!getInputValue(kConn, kNodeData) ? 1 : 0;

    const clkConn = useNodeConnections({ handleType: 'target', handleId: 'clk' });
    const clkNodeData = useNodesData(clkConn?.[0]?.source);
    const clkData = !!getInputValue(clkConn, clkNodeData) ? 1 : 0;

    const lastClk = useRef(0);
    const [q, setQ] = useState(0);

    useEffect(() => {
        const isPositiveEdge = lastClk.current === 0 && clkData === 1;

        if (isPositiveEdge) {
            if (jData === 1 && kData === 0) {
                setQ(1);          // Set
            } else if (jData === 0 && kData === 1) {
                setQ(0);          // Reset
            } else if (jData === 1 && kData === 1) {
                setQ(prev => prev === 1 ? 0 : 1);  // Toggle
            }
            // J=0, K=0 → no change
        }
        lastClk.current = clkData;
    }, [clkData, jData, kData]);

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
            <span className="text-xs font-bold text-orange-700">JK FF</span>

            <Handle type="target" position={Position.Left} isConnectable={jConn.length === 0} style={{ top: '25%' }} id="j" />
            <span className="absolute left-2 top-[18%] text-[8px] text-orange-800 pointer-events-none">J</span>

            <Handle type="target" position={Position.Left} isConnectable={kConn.length === 0} style={{ top: '50%' }} id="k" />
            <span className="absolute left-2 top-[43%] text-[8px] text-orange-800 pointer-events-none">K</span>

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
