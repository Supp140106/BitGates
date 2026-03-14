import { useEffect } from 'react';
import {

    Handle,
    useNodeConnections,
    useNodesData,
    Position,
    useReactFlow,
} from '@xyflow/react';
import { getInputValue } from './utils';

export default function DEC24Gate({ id, data }) {
    const { updateNodeData } = useReactFlow();

    // Inputs
    const a0Conn = useNodeConnections({ handleType: 'target', handleId: 'a0' });
    const a0NodeData = useNodesData(a0Conn?.[0]?.source);
    const a0Data = getInputValue(a0Conn, a0NodeData);

    const a1Conn = useNodeConnections({ handleType: 'target', handleId: 'a1' });
    const a1NodeData = useNodesData(a1Conn?.[0]?.source);
    const a1Data = getInputValue(a1Conn, a1NodeData);

    // Enable Input (E)
    const eConn = useNodeConnections({ handleType: 'target', handleId: 'e' });
    const eNodeData = useNodesData(eConn?.[0]?.source);
    const eData = getInputValue(eConn, eNodeData);

    // Logic
    const y0 = !!(eData && !a1Data && !a0Data);
    const y1 = !!(eData && !a1Data && a0Data);
    const y2 = !!(eData && a1Data && !a0Data);
    const y3 = !!(eData && a1Data && a0Data);

    useEffect(() => {
        updateNodeData(id, (node) => ({
            ...node.data,
            y0,
            y1,
            y2,
            y3
        }));
    }, [y0, y1, y2, y3, id, updateNodeData]);

    return (
        <div className='h-32 w-20 bg-blue-200 border-2 border-blue-500 rounded relative flex items-center justify-center flex-col'>
            <span className="text-sm font-bold text-blue-700">DEC</span>
            <span className="text-xs text-blue-600">2:4</span>

            {/* Inputs */}
            <Handle type="target" position={Position.Left} isConnectable={a0Conn.length == 0} style={{ top: '25%' }} id="a0" />
            <span className="absolute left-2 top-[20%] text-[10px] text-blue-800 pointer-events-none">A0</span>

            <Handle type="target" position={Position.Left} isConnectable={a1Conn.length == 0} style={{ top: '50%' }} id="a1" />
            <span className="absolute left-2 top-[45%] text-[10px] text-blue-800 pointer-events-none">A1</span>

            <Handle type="target" position={Position.Left} isConnectable={eConn.length == 0} style={{ top: '75%' }} id="e" />
            <span className="absolute left-2 top-[70%] text-[10px] text-blue-800 pointer-events-none">E</span>

            {/* Outputs */}
            <Handle type="source" position={Position.Right} isConnectable={true} style={{ top: '20%' }} id="y0" />
            <span className="absolute right-2 top-[15%] text-[10px] text-blue-800 pointer-events-none">Y0</span>

            <Handle type="source" position={Position.Right} isConnectable={true} style={{ top: '40%' }} id="y1" />
            <span className="absolute right-2 top-[35%] text-[10px] text-blue-800 pointer-events-none">Y1</span>

            <Handle type="source" position={Position.Right} isConnectable={true} style={{ top: '60%' }} id="y2" />
            <span className="absolute right-2 top-[55%] text-[10px] text-blue-800 pointer-events-none">Y2</span>

            <Handle type="source" position={Position.Right} isConnectable={true} style={{ top: '80%' }} id="y3" />
            <span className="absolute right-2 top-[75%] text-[10px] text-blue-800 pointer-events-none">Y3</span>
        </div>
    );
}
