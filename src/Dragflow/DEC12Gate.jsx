import { useEffect } from 'react';
import {

    Handle,
    useNodeConnections,
    useNodesData,
    Position,
    useReactFlow,
} from '@xyflow/react';
import { getInputValue } from './utils';

export default function DEC12Gate({ id, data }) {
    const { updateNodeData } = useReactFlow();

    // Data Input (A)
    const aConn = useNodeConnections({ handleType: 'target', handleId: 'a' });
    const aNodeData = useNodesData(aConn?.[0]?.source);
    const aData = getInputValue(aConn, aNodeData);

    // Enable Input (E)
    const eConn = useNodeConnections({ handleType: 'target', handleId: 'e' });
    const eNodeData = useNodesData(eConn?.[0]?.source);
    const eData = getInputValue(eConn, eNodeData);

    // Logic: 
    // Y0 = E && !A
    // Y1 = E && A
    const y0 = !!(eData && !aData);
    const y1 = !!(eData && aData);

    useEffect(() => {
        updateNodeData(id, (node) => ({
            ...node.data,
            y0,
            y1,
        }));
    }, [y0, y1, id, updateNodeData]);

    // A component outputting multiple values might need a custom approach if `value` was single,
    // but typically BitDisplay only reads a single source unless we adapt it. We'll output them 
    // and connections can pull what they need. Current design of BitDisplay seems to read `value`.
    // To handle multiple outputs gracefully in a simple way, we set data correctly for downstream nodes to read.

    return (
        <div className='h-20 w-16 bg-blue-200 border-2 border-blue-500 rounded relative flex items-center justify-center flex-col'>
            <span className="text-xs font-bold text-blue-700">DEC</span>
            <span className="text-[10px] text-blue-600">1:2</span>

            {/* Input A */}
            <Handle type="target" position={Position.Left} isConnectable={aConn.length == 0} style={{ top: '30%' }} id="a" />
            <span className="absolute left-2 top-[22%] text-[8px] text-blue-800 pointer-events-none">A</span>

            {/* Enable E */}
            <Handle type="target" position={Position.Left} isConnectable={eConn.length == 0} style={{ top: '70%' }} id="e" />
            <span className="absolute left-2 top-[62%] text-[8px] text-blue-800 pointer-events-none">E</span>

            {/* Outputs */}
            <Handle type="source" position={Position.Right} isConnectable={true} style={{ top: '30%' }} id="y0" />
            <span className="absolute right-2 top-[22%] text-[8px] text-blue-800 pointer-events-none">Y0</span>
            <Handle type="source" position={Position.Right} isConnectable={true} style={{ top: '70%' }} id="y1" />
            <span className="absolute right-2 top-[62%] text-[8px] text-blue-800 pointer-events-none">Y1</span>
        </div>
    );
}
