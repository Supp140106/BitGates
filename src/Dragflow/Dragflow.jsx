import React, { useRef, useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  Panel,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import ORGate from './ORGate';
import Sidebar from './Sidebar';
import { DnDProvider, useDnD } from './DnDContext';
import StepEdge from './StepEdge';
import ANDGate from './ANDGate';
import NOTGate from './NOTGate';
import BitInput from './BitInput';
import BitDisplay from './Display';
import NORGate from './NorGate';
import NANDGate from './NANDGate';
import XORGate from './XORGate';
import XNORGate from './XNORGates';
import { useParams, useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { load } from '@tauri-apps/plugin-store';

const edgeTypes = {
  step: StepEdge,
};

const nodeTypes = {
  orgate: ORGate,
  andgate: ANDGate,
  notgate: NOTGate,
  bitinput: BitInput,
  bitdisplay: BitDisplay,
  norgate: NORGate,
  nandgate: NANDGate,
  xorgate: XORGate,
  xnorgate: XNORGate
};

const initialNodes = [
  {
    id: '1',
    type: 'bitinput',
    data: { label: 'orgate' },
    position: { x: 250, y: 5 },
  },
];

async function getProject(id){
  const result = await invoke('get_project_by_id',{
    id : id
  })
  return result
}



let id = 0;
const getId = () => `dndnode_${id++}`;



const DnDFlow = ({projectId}) => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();
  const navigate = useNavigate();

  // Store state
  const [store, setStore] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [workflows, setWorkflows] = useState([]);

  // History for undo/redo
  const [history, setHistory] = useState([{ nodes: initialNodes, edges: [] }]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Autosave timer
  const autosaveTimerRef = useRef(null);

  // Initialize store
  useEffect(() => {
    const initStore = async () => {
      try {
        const storeInstance = await load(`workflow-${projectId}.json`, {
          autoSave: false // We'll handle saving manually for better control
        });
        setStore(storeInstance);
        
        // Load existing workflows list
        const savedWorkflows = await storeInstance.get('workflows') || [];
        setWorkflows(savedWorkflows);
        
        // Load the current workflow if it exists
        await loadCurrentWorkflow(storeInstance);
      } catch (error) {
        console.error('Failed to initialize store:', error);
      }
    };
    
    if (projectId) {
      initStore();
    }
  }, [projectId]);

  // Load current workflow from store
  const loadCurrentWorkflow = async (storeInstance) => {
    try {
      const currentWorkflow = await storeInstance.get('currentWorkflow');
      if (currentWorkflow) {
        setNodes(currentWorkflow.nodes || initialNodes);
        setEdges(currentWorkflow.edges || []);
        setHistory([{ nodes: currentWorkflow.nodes || initialNodes, edges: currentWorkflow.edges || [] }]);
        setCurrentIndex(0);
        setLastSaved(new Date(currentWorkflow.timestamp));
      }
    } catch (error) {
      console.error('Failed to load current workflow:', error);
    }
  };

  // Save current workflow to store
  const saveCurrentWorkflow = useCallback(async (currentNodes = nodes, currentEdges = edges, manual = false) => {
    if (!store) return;
    
    setIsSaving(true);
    try {
      const timestamp = new Date().toISOString();
      const workflowData = {
        nodes: currentNodes,
        edges: currentEdges,
        timestamp,
        projectId
      };
      
      await store.set('currentWorkflow', workflowData);
      await store.save();
      
      setLastSaved(new Date(timestamp));
      
      if (manual) {
        console.log('Workflow saved manually');
      }
    } catch (error) {
      console.error('Failed to save workflow:', error);
    } finally {
      setIsSaving(false);
    }
  }, [store, nodes, edges, projectId]);

  // Save named workflow
  const saveNamedWorkflow = useCallback(async (name) => {
    if (!store || !name.trim()) return;
    
    setIsSaving(true);
    try {
      const timestamp = new Date().toISOString();
      const workflowData = {
        name: name.trim(),
        nodes,
        edges,
        timestamp,
        projectId
      };
      
      const savedWorkflows = await store.get('workflows') || [];
      const existingIndex = savedWorkflows.findIndex(w => w.name === name.trim());
      
      if (existingIndex >= 0) {
        savedWorkflows[existingIndex] = workflowData;
      } else {
        savedWorkflows.push(workflowData);
      }
      
      await store.set('workflows', savedWorkflows);
      await store.save();
      
      setWorkflows(savedWorkflows);
      console.log(`Workflow "${name}" saved successfully`);
    } catch (error) {
      console.error('Failed to save named workflow:', error);
    } finally {
      setIsSaving(false);
    }
  }, [store, nodes, edges, projectId]);

  // Load named workflow
  const loadNamedWorkflow = useCallback(async (workflowName) => {
    if (!store) return;
    
    try {
      const savedWorkflows = await store.get('workflows') || [];
      const workflow = savedWorkflows.find(w => w.name === workflowName);
      
      if (workflow) {
        setNodes(workflow.nodes || initialNodes);
        setEdges(workflow.edges || []);
        setHistory([{ nodes: workflow.nodes || initialNodes, edges: workflow.edges || [] }]);
        setCurrentIndex(0);
        console.log(`Workflow "${workflowName}" loaded successfully`);
      } else {
        console.error(`Workflow "${workflowName}" not found`);
      }
    } catch (error) {
      console.error('Failed to load workflow:', error);
    }
  }, [store, setNodes, setEdges]);

  // Autosave functionality
  const scheduleAutosave = useCallback(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }
    
    autosaveTimerRef.current = setTimeout(() => {
      saveCurrentWorkflow(nodes, edges, false);
    }, 2000); // Autosave after 2 seconds of inactivity
  }, [saveCurrentWorkflow, nodes, edges]);

  // Save state to history
  const saveState = useCallback((newNodes, newEdges) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push({ nodes: [...newNodes], edges: [...newEdges] });
      return newHistory;
    });
    setCurrentIndex(prev => prev + 1);
    
    // Schedule autosave
    scheduleAutosave();
  }, [currentIndex, scheduleAutosave]);

  // Undo/Redo keyboard shortcuts with save shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'z' && !event.shiftKey) {
          event.preventDefault();
          if (currentIndex > 0) {
            const prevState = history[currentIndex - 1];
            setNodes(prevState.nodes);
            setEdges(prevState.edges);
            setCurrentIndex(prev => prev - 1);
          }
        } else if (event.key === 'y' || (event.key === 'z' && event.shiftKey)) {
          event.preventDefault();
          if (currentIndex < history.length - 1) {
            const nextState = history[currentIndex + 1];
            setNodes(nextState.nodes);
            setEdges(nextState.edges);
            setCurrentIndex(prev => prev + 1);
          }
        } else if (event.key === 's') {
          event.preventDefault();
          saveCurrentWorkflow(nodes, edges, true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [history, currentIndex, setNodes, setEdges, saveCurrentWorkflow, nodes, edges]);

  // Cleanup autosave timer on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, []);

  const onConnect = useCallback((params) => {
    setEdges((eds) => {
      const newEdges = addEdge(
        {
          ...params,
          type: 'smoothstep',
          stroke: 'red',
          style: {
            strokeWidth: 1,
            stroke: '#FF0072',
          },
        },
        eds
      );
      setTimeout(() => saveState(nodes, newEdges), 100);
      return newEdges;
    });
  }, [nodes, saveState]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => {
        const newNodes = nds.concat(newNode);
        setTimeout(() => saveState(newNodes, edges), 100);
        return newNodes;
      });
    },
    [screenToFlowPosition, type, edges, saveState],
  );

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.setData('text/plain', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Enhanced handlers to save state
  const handleNodesChange = useCallback((changes) => {
    onNodesChange(changes);
    const hasSignificantChange = changes.some(change =>
      change.type === 'remove' || (change.type === 'position' && change.dragging === false)
    );
    if (hasSignificantChange) {
      setTimeout(() => saveState(nodes, edges), 100);
    }
  }, [onNodesChange, nodes, edges, saveState]);

  const handleEdgesChange = useCallback((changes) => {
    onEdgesChange(changes);
    const hasSignificantChange = changes.some(change => change.type === 'remove');
    if (hasSignificantChange) {
      setTimeout(() => saveState(nodes, edges), 100);
    }
  }, [onEdgesChange, nodes, edges, saveState]);

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Background color='skyblue' variant={BackgroundVariant.Lines} />
          <Panel position="top-left">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 min-w-64">
              {/* Header */}
              

              {/* Navigation */}
              <div className="mb-4">
                <button
                  className="w-full flex items-center justify-center px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200"
                  onClick={() => navigate('/')}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Projects
                </button>
              </div>
              
              {/* Save/Load Section */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isSaving
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                    }`}
                    onClick={() => saveCurrentWorkflow(nodes, edges, true)}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Save
                      </>
                    )}
                  </button>
                  
                  <button
                    className='flex items-center justify-center px-3 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md'
                    onClick={()=>{
                      if (confirm('Are you sure you want to clear the workflow? This action cannot be undone.')) {
                        setEdges([]);
                        setNodes([]);
                        // Clear from store as well
                        if (store) {
                          store.set('currentWorkflow', {
                            nodes: [],
                            edges: [],
                            timestamp: new Date().toISOString(),
                            projectId
                          });
                          store.save();
                        }
                      }
                    }}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear
                  </button>
                </div>

                
              </div>
            </div>
          </Panel>
          <MiniMap />
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
};

export default function Dragflow() {
  const { projectId } = useParams();
  console.log(projectId)
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <DnDFlow projectId={projectId}/>
      </DnDProvider>
    </ReactFlowProvider>
  );
}