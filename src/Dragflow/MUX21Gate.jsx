import { useEffect, useCallback } from 'react';
import {

    Handle,
    useNodeConnections,
    useNodesData,
    Position,
    useReactFlow,
} from '@xyflow/react';
import { getInputValue } from './utils';

export default function MUX21Gate({ id, data }) {
    const { updateNodeData } = useReactFlow();

    // Get D0 input connection (handle "d0")
    const d0Conn = useNodeConnections({ handleType: 'target', handleId: 'd0' });
    const d0NodeData = useNodesData(d0Conn?.[0]?.source);

    // Get D1 input connection (handle "d1")
    const d1Conn = useNodeConnections({ handleType: 'target', handleId: 'd1' });
    const d1NodeData = useNodesData(d1Conn?.[0]?.source);

    // Get Select input connection (handle "s")
    const sConn = useNodeConnections({ handleType: 'target', handleId: 's' });
    const sNodeData = useNodesData(sConn?.[0]?.source);

    const inputD0 = getInputValue(d0Conn, d0NodeData);
    const inputD1 = getInputValue(d1Conn, d1NodeData);
    const inputS = getInputValue(sConn, sNodeData);

    // Logic: output = S ? D1 : D0
    const result = inputS ? inputD1 : inputD0;

    useEffect(() => {
        updateNodeData(id, (node) => ({
            ...node.data,
            value: !!result, // ensure boolean/0-1 logic matching
        }));
    }, [result, id, updateNodeData]);

    return (
        <div className='h-16 w-12 bg-purple-200 border-2 border-purple-500 rounded relative flex items-center justify-center flex-col'>
            <span className="text-xs font-bold text-purple-700">MUX</span>
            <span className="text-[10px] text-purple-600">2:1</span>

            {/* D0 Input */}
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={d0Conn.length == 0}
                style={{ top: '25%' }}
                id="d0"
            />

            {/* D1 Input */}
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={d1Conn.length == 0}
                style={{ top: '75%' }}
                id="d1"
            />

            {/* Select Input (S) - Bottom */}
            <Handle
                type="target"
                position={Position.Bottom}
                isConnectable={sConn.length == 0}
                id="s"
            />

            {/* Output (Y) */}
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={true}
                id="y"
            />
        </div>
    );
}
