import React, { useCallback, useRef, useState } from "react";
import { useReactFlow } from "@xyflow/react";

export default function useHistory() {
  const [history, setHistory] = useState([]);
  const currentIndex = useRef(-1);

  const { setNodes, setEdges } = useReactFlow();

  const addToHistory = useCallback(
    (newState) => {
      const newHistory = [...history].slice(0, currentIndex.current + 1);
      newHistory.push(newState);
      setHistory(newHistory);
      currentIndex.current += 1;
    },
    [history]
  );

  const addNode = useCallback(
    (node, shouldAddToHistory = true) => {
      if (node) setNodes((prevNodes) => prevNodes.concat(node));
      if (shouldAddToHistory)
        addToHistory({
          action: "add-node",
          data: node,
        });
    },
    [addToHistory, setNodes]
  );

  const addEdge = useCallback(
    (edge, shouldAddToHistory = true) => {
      if (edge) setEdges((prevEdges) => prevEdges.concat(edge));
      if (shouldAddToHistory)
        addToHistory({
          action: "add-edge",
          data: edge,
        });
    },
    [addToHistory, setEdges]
  );

  const removeNode = useCallback(
    (node, shouldAddToHistory = true) => {
      if (node)
        setNodes((prevNodes) =>
          prevNodes.filter((prevNode) => prevNode.id !== node.id)
        );
      if (shouldAddToHistory)
        addToHistory({
          action: "remove-node",
          data: node,
        });
    },
    [addToHistory, setNodes]
  );

  const removeEdge = useCallback(
    (edge, shouldAddToHistory = true) => {
      if (edge)
        setEdges((prevEdges) =>
          prevEdges.filter((prevEdge) => prevEdge.id !== edge.id)
        );
      if (shouldAddToHistory)
        addToHistory({
          action: "remove-edge",
          data: edge,
        });
    },
    [addToHistory, setEdges]
  );

  const undo = useCallback(() => {
    const canUndo = currentIndex.current > -1;
    if (canUndo) {
      const { action, data } = history[currentIndex.current] || {};
      currentIndex.current -= 1;
      switch (action) {
        case "add-node": {
          removeNode(data, false);
          break;
        }
        case "add-edge": {
          removeEdge(data, false);
          break;
        }
        case "remove-node": {
          addNode(data, false);
          break;
        }
        case "remove-edge": {
          addEdge(data, false);
          break;
        }
      }
    }
  }, [addEdge, addNode, history, removeEdge, removeNode]);

  const redo = useCallback(() => {
    const canRedo = currentIndex.current < history.length - 1;
    if (canRedo) {
      currentIndex.current += 1;
      const { action, data } = history[currentIndex.current] || {};
      switch (action) {
        case "add-node": {
          addNode(data, false);
          break;
        }
        case "add-edge": {
          addEdge(data, false);
          break;
        }
        case "remove-node": {
          removeNode(data, false);
          break;
        }
        case "remove-edge": {
          removeEdge(data, false);
          break;
        }
      }
    }
  }, [addEdge, addNode, history, removeEdge, removeNode]);

  return { addNode, removeNode, addEdge, removeEdge, undo, redo };
}
