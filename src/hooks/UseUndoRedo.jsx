import { useState, useEffect } from 'react';

export default function useUndoRedo({ initialNodes, initialEdges, setNodes, setEdges }) {
  const [history, setHistory] = useState([{ nodes: initialNodes, edges: initialEdges }]);
  const [redoStack, setRedoStack] = useState([]);

  const updateHistory = (newNodes, newEdges) => {
    setHistory((prev) => [...prev, { nodes: newNodes, edges: newEdges }]);
    setRedoStack([]); 
  };

  const undo = () => {
    if (history.length <= 1) return;
    const prev = history[history.length - 2];
    setRedoStack((r) => [history[history.length - 1], ...r]);
    setNodes(prev.nodes);
    setEdges(prev.edges);
    setHistory((h) => h.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory((h) => [...h, next]);
    setNodes(next.nodes);
    setEdges(next.edges);
    setRedoStack((r) => r.slice(1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, redoStack]);

  return { updateHistory, undo, redo };
}
