import { useEffect, useState, useRef } from 'react';
import {
    Handle,
    Position,
    useReactFlow,
} from '@xyflow/react';
import { Star, Square } from 'lucide-react';

export default function ClockNode({ id, data }) {
    const { updateNodeData } = useReactFlow();
    const [active, setActive] = useState(false);
    const [pulse, setPulse] = useState(0);
    const timerRef = useRef(null);

    const toggleActive = () => {
        setActive(prev => !prev);
    };

    useEffect(() => {
        if (active) {
            timerRef.current = setInterval(() => {
                setPulse(prev => (prev === 1 ? 0 : 1));
            }, 1000);
        } else {
            clearInterval(timerRef.current);
            setPulse(0);
        }

        return () => clearInterval(timerRef.current);
    }, [active]);

    useEffect(() => {
        updateNodeData(id, (node) => ({
            ...node.data,
            value: pulse,
        }));
    }, [pulse, id, updateNodeData]);

    return (
        <div className='h-20 w-16 bg-sky-100 border-2 border-sky-500 rounded relative flex items-center justify-center flex-col p-2 shadow-md'>
            <span className="text-xs font-bold text-sky-700 mb-2">CLOCK</span>

            <button
                onClick={toggleActive}
                className={`p-1 rounded-full transition-colors duration-200 ${active ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}
            >
                {active ? <Square size={16} color="white" fill="white" /> : <Star size={16} color="white" fill="white" />}
            </button>

            <div className={`mt-2 w-3 h-3 rounded-full border border-sky-400 ${pulse === 1 ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'bg-gray-300'}`} />

            {/* Output Handle */}
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={true}
                id="pulse"
            />
        </div>
    );
}
