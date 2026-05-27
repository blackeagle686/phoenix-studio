import React, { useState, useCallback, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType
} from 'reactflow';
import CustomNode from '../components/Nodes/CustomNode';
import BlocksPanel from '../components/Sidebar/BlocksPanel';
import PropertiesPanel from '../components/Sidebar/PropertiesPanel';
import '../App.css';

// Map custom node types to React Flow
const nodeTypes = {
  agent: CustomNode,
  openai_llm: CustomNode,
  local_llm: CustomNode,
  hybrid_memory: CustomNode,
  default_tool: CustomNode,
  custom_tool: CustomNode,
  chatbot: CustomNode,
  rag: CustomNode,
  openai_vlm: CustomNode,
  local_vlm: CustomNode,
  tts_node: CustomNode,
  stt_node: CustomNode,
  data_source: CustomNode,
  api_export: CustomNode,
  github_repo: CustomNode,
  data_folder: CustomNode,
  web_data_api: CustomNode
};

// Initial nodes
const initialNodes = [
  {
    id: 'agent-1',
    type: 'agent',
    data: { name: 'PhoenixAgent', session_id: 'default' },
    position: { x: 450, y: 150 },
  },
  {
    id: 'llm-1',
    type: 'openai_llm',
    data: { model: 'gpt-4o', api_key: '' },
    position: { x: 100, y: 80 },
  },
  {
    id: 'mem-1',
    type: 'hybrid_memory',
    data: { use_redis: true },
    position: { x: 100, y: 260 },
  },
];

const initialEdges = [];

function WorkspaceEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workspaceName, setWorkspaceName] = useState('Untitled Workspace');
  const [workspaceMode, setWorkspaceMode] = useState('chatbot'); // 'chatbot' or 'agent'
  const [isSaving, setIsSaving] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [globalCode, setGlobalCode] = useState('');
  const [showCodeDrawer, setShowCodeDrawer] = useState(true);
  const [drawerTab, setDrawerTab] = useState('code'); // 'code' or 'run'
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [runMessage, setRunMessage] = useState('What is the weather in New York?');
  const [runLogs, setRunLogs] = useState('');
  const [runResponse, setRunResponse] = useState('');
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [showPropertiesModal, setShowPropertiesModal] = useState(false);

  // Export Modal State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTemplate, setExportTemplate] = useState('raw'); // 'raw', 'full_screen', 'widget'
  const [exportGradientColors, setExportGradientColors] = useState(['#00f2fe', '#4facfe', '#00f2fe']);
  const [exportTheme, setExportTheme] = useState('dark'); // 'dark' or 'light'

  // Resizable Drawer State
  const [drawerHeight, setDrawerHeight] = useState(300);
  const isDraggingDrawer = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingDrawer.current) return;
      // Calculate new height based on window height minus mouse Y and bottom padding (15px)
      const newHeight = window.innerHeight - e.clientY - 15;
      setDrawerHeight(Math.max(150, Math.min(newHeight, window.innerHeight - 150)));
    };
    const handleMouseUp = () => {
      if (isDraggingDrawer.current) {
        isDraggingDrawer.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto'; // Re-enable text selection
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Retrieve selected node object
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // Load workspace data
  useEffect(() => {
    const loadWorkspace = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/workspaces/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setWorkspaceName(data.name);
          if (data.graph_data) {
            const graph = JSON.parse(data.graph_data);
            if (graph.nodes && graph.nodes.length > 0) setNodes(graph.nodes);
            if (graph.edges && graph.edges.length > 0) setEdges(graph.edges);
          }
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Failed to load workspace', err);
      }
    };
    loadWorkspace();
  }, [id, token, navigate, setNodes, setEdges]);

  // Save workspace data
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`http://localhost:8000/api/workspaces/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: workspaceName,
          graph_data: JSON.stringify({ nodes, edges })
        })
      });
      if (!response.ok) alert('Failed to save workspace');
    } catch (err) {
      console.error(err);
      alert('Error communicating with server');
    } finally {
      setIsSaving(false);
    }
  };

  // Track select events
  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
    setShowPropertiesModal(true);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // Update selected node config data
  const onUpdateNode = useCallback((id, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: newData };
        }
        return node;
      })
    );
  }, [setNodes]);

  // Delete node and its edges
  const onDeleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    if (selectedNodeId === id) {
      setSelectedNodeId(null);
    }
  }, [selectedNodeId, setNodes, setEdges]);

  // Add node helper
  const onAddNode = useCallback((type, defaultData) => {
    const id = `${type}-${Date.now()}`;
    // Position slightly offset from center
    const position = {
      x: 200 + Math.random() * 100,
      y: 150 + Math.random() * 100
    };
    const newNode = {
      id,
      type,
      data: { ...defaultData },
      position
    };
    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(id);
  }, [setNodes]);

  // React Flow onConnect handler
  const onConnect = useCallback(
    (params) => {
      // Color connections according to source node types
      const sourceNode = nodes.find((n) => n.id === params.source);
      let edgeColor = '#5c5d73';
      if (sourceNode) {
        if (sourceNode.type === 'openai_llm') edgeColor = '#9b51e0';
        else if (sourceNode.type === 'local_llm') edgeColor = '#4facfe';
        else if (sourceNode.type === 'hybrid_memory') edgeColor = '#f093fb';
        else if (sourceNode.type === 'default_tool' || sourceNode.type === 'custom_tool') edgeColor = '#00ff87';
      }

      setEdges((eds) => 
        addEdge(
          { 
            ...params, 
            animated: true,
            style: { stroke: edgeColor },
            markerEnd: { type: MarkerType.ArrowClosed, color: edgeColor }
          }, 
          eds
        )
      );
    },
    [nodes, setEdges]
  );

  // Sync global code preview
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nodes, edges })
        });
        if (response.ok) {
          const data = await response.json();
          setGlobalCode(data.code);
        }
      } catch (err) {
        console.error('Failed to fetch code preview:', err);
      }
    };
    
    // Simple debounce to prevent flooding backend requests
    const timeout = setTimeout(fetchPreview, 400);
    return () => clearTimeout(timeout);
  }, [nodes, edges]);

  // Handle template preview
  const handlePreviewTemplate = async () => {
    if (exportTemplate === 'raw') return;
    try {
      const payload = {
        nodes,
        edges,
        template_type: exportTemplate,
        gradient_colors: exportGradientColors,
        theme_mode: exportTheme
      };
      
      const response = await fetch('http://localhost:8000/api/preview_template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        // Open a new window and write the HTML
        const newWin = window.open('', '_blank');
        if (newWin) {
          newWin.document.open();
          newWin.document.write(data.html);
          newWin.document.close();
        } else {
          alert('Popup blocked! Please allow popups for this site to preview templates.');
        }
      } else {
        alert('Failed to load template preview.');
      }
    } catch (err) {
      alert('Error communicating with preview endpoint.');
      console.error(err);
    }
  };

  // Handle ZIP generate download
  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const payload = {
        nodes,
        edges,
        template_type: exportTemplate,
        gradient_colors: exportGradientColors,
        theme_mode: exportTheme
      };
      
      const response = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedNode?.data?.name || 'phoenix_app'}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setShowExportModal(false);
      } else {
        alert('Failed to package project archive.');
      }
    } catch (err) {
      alert('Error communicating with generation endpoint.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRun = async () => {
    if (!runMessage.trim()) return;
    setIsExecuting(true);
    setRunLogs('Running...\n');
    setRunResponse('');
    try {
      const response = await fetch('http://localhost:8000/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          graph: { nodes, edges },
          message: runMessage,
          session_id: selectedNode?.data?.session_id || 'default'
        })
      });
      if (response.ok) {
        const data = await response.json();
        setRunLogs(data.logs);
        setRunResponse(data.response);
      } else {
        setRunLogs(`Error: HTTP ${response.status}`);
      }
    } catch (err) {
      setRunLogs(`Request Failed: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background visual layers */}
      <div className="ambient-bg"></div>

      {/* Top Navbar / Controls */}
      <nav
        className="navbar navbar-expand-lg navbar-dark glass-panel py-2 px-3 position-absolute"
        style={{
          top: '15px',
          left: '15px',
          right: '15px',
          width: 'calc(100% - 30px)',
          zIndex: 100,
          borderRadius: '12px',
        }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          
          {/* Left Brand Area */}
          <div className="d-flex align-items-center flex-grow-1 flex-lg-grow-0 overflow-hidden me-3">
            <button className="btn btn-link text-mint p-0 me-2" onClick={() => navigate('/dashboard')} title="Back to Dashboard">
              <i className="bi bi-arrow-left fs-4"></i>
            </button>
            <i className="bi bi-circle-fill text-mint me-2 fs-6 d-none d-sm-inline"></i>
            <span
              className="d-none d-md-inline"
              style={{
                fontFamily: 'var(--font-title)',
                fontWeight: 700,
                fontSize: '1.2rem',
                letterSpacing: '1px',
                color: 'white',
              }}
            >
              PHOENIX-AI <span className="text-mint d-none d-lg-inline">STUDIO</span>
            </span>
            <span className="ms-2 ms-md-3 text-secondary d-none d-md-inline">|</span>
            <span className="ms-2 ms-md-3 text-light fw-semibold text-truncate" style={{ maxWidth: '150px' }}>{workspaceName}</span>
          </div>

          {/* Mobile Toggler */}
          <button className="navbar-toggler shadow-none border-0 ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#workspaceNavbar">
            <span className="navbar-toggler-icon" style={{ width: '1.2em', height: '1.2em' }}></span>
          </button>

          {/* Collapsible Right Controls */}
          <div className="collapse navbar-collapse justify-content-end" id="workspaceNavbar">
            <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3 mt-3 mt-lg-0">
              
              {/* Mode Toggle */}
              <div className="btn-group me-lg-3" role="group">
                <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" checked={workspaceMode === 'chatbot'} onChange={() => setWorkspaceMode('chatbot')} />
                <label className="btn btn-sm btn-outline-mint" htmlFor="btnradio1"><i className="bi bi-chat-left-dots-fill me-1"></i> ChatBot</label>

                <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" checked={workspaceMode === 'agent'} onChange={() => setWorkspaceMode('agent')} />
                <label className="btn btn-sm btn-outline-mint" htmlFor="btnradio2"><i className="bi bi-cpu-fill me-1"></i> Agent</label>
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-sm btn-outline-light d-flex align-items-center gap-1"
                  style={{ borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-cloud-arrow-up text-primary"></i>}
                  Save
                </button>
                
                <button
                  className={`btn btn-sm ${showCodeDrawer && drawerTab === 'code' ? 'btn-light text-dark' : 'btn-outline-light'} d-flex align-items-center gap-1`}
                  style={{
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: showCodeDrawer && drawerTab === 'code' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.05)',
                  }}
                  onClick={() => {
                    if (showCodeDrawer && drawerTab === 'code') setShowCodeDrawer(false);
                    else {
                      setShowCodeDrawer(true);
                      setDrawerTab('code');
                    }
                  }}
                >
                  <i className="bi bi-code-square"></i> Show Code
                </button>

                <button
                  className={`btn btn-sm ${showCodeDrawer && drawerTab === 'run' ? 'btn-light text-dark' : 'btn-outline-light'} d-flex align-items-center gap-1`}
                  style={{
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: showCodeDrawer && drawerTab === 'run' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.05)',
                  }}
                  onClick={() => {
                    if (showCodeDrawer && drawerTab === 'run') setShowCodeDrawer(false);
                    else {
                      setShowCodeDrawer(true);
                      setDrawerTab('run');
                    }
                  }}
                >
                  <i className="bi bi-play-fill text-success"></i> Run Flow
                </button>
              </div>

              <button
                className="btn btn-mint d-flex align-items-center justify-content-center gap-2 mt-2 mt-lg-0"
                style={{
                  fontFamily: 'var(--font-body)',
                  padding: '6px 16px',
                  borderRadius: '8px'
                }}
                onClick={() => setShowExportModal(true)}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Building...</>
                ) : (
                  <><i className="bi bi-download"></i> Export</>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Workspace Panel */}
      <div 
        className="d-flex w-100" 
        style={{ 
          height: `calc(100vh - ${showCodeDrawer ? drawerHeight + 20 : 0}px)`, 
          paddingTop: '95px',
          transition: isDraggingDrawer.current ? 'none' : 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* Left Side: Blocks panel */}
        <div 
          className="p-3 pr-0" 
          style={{ 
            height: '100%', 
            width: leftSidebarOpen ? '320px' : '0px', 
            overflow: 'hidden', 
            opacity: leftSidebarOpen ? 1 : 0, 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            padding: leftSidebarOpen ? '' : '0 !important'
          }}
        >
          <BlocksPanel onAddNode={onAddNode} workspaceMode={workspaceMode} />
        </div>

        {/* Center: Canvas workspace */}
        <div className="flex-grow-1 p-3" style={{ height: '100%', minWidth: 0 }}>
          <div className="glass-panel w-100 h-100 overflow-hidden" style={{ position: 'relative' }}>
            <button 
              className="btn btn-sm btn-outline-info position-absolute"
              style={{ top: '15px', left: '15px', zIndex: 10, background: 'rgba(0,0,0,0.5)', border: '1px solid var(--accent-cyan)' }}
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
              title="Toggle Blocks Panel"
            >
              <i className={`bi ${leftSidebarOpen ? 'bi-chevron-left' : 'bi-list'}`}></i>
            </button>

            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              fitView
            >
              <Background color="#5c5d73" gap={20} size={1} />
              <Controls />
              <MiniMap nodeStrokeWidth={3} zoomable pannable />
            </ReactFlow>
          </div>
        </div>

      {/* Properties Modal */}
      {showPropertiesModal && (
        <PropertiesPanel 
          selectedNode={selectedNode}
          onUpdateNode={onUpdateNode}
          onDeleteNode={onDeleteNode}
          onClose={() => setShowPropertiesModal(false)}
        />
      )}
      </div>

      {/* Bottom Collapsible Global Code Preview Drawer */}
      <div
        className="glass-panel position-absolute"
        style={{
          bottom: '15px',
          left: '15px',
          right: '15px',
          height: `${drawerHeight}px`,
          zIndex: 90,
          borderRadius: '12px',
          transform: showCodeDrawer ? 'translateY(0)' : `translateY(${drawerHeight + 30}px)`,
          transition: isDraggingDrawer.current ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'left'
        }}
      >
        {/* Resize Handle */}
        <div 
          className="w-100 d-flex justify-content-center align-items-center"
          style={{ height: '8px', cursor: 'ns-resize', background: 'rgba(255,255,255,0.02)' }}
          onMouseDown={() => {
            isDraggingDrawer.current = true;
            document.body.style.cursor = 'ns-resize';
            document.body.style.userSelect = 'none'; // Prevent text selection during drag
          }}
        >
          <div style={{ width: '40px', height: '4px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}></div>
        </div>
        {/* Header of Drawer */}
        <div className="d-flex justify-content-between align-items-center px-4 py-2" style={{ borderBottom: '1px solid var(--glass-border)' }}>
          <span className="fw-semibold text-white d-flex align-items-center gap-2" style={{ fontFamily: 'var(--font-title)', fontSize: '0.95rem' }}>
            {drawerTab === 'code' ? (
              <><i className="bi bi-file-earmark-code text-mint"></i> Python Project Source</>
            ) : (
              <><i className="bi bi-terminal-fill text-mint"></i> Live Execution Console</>
            )}
          </span>
        </div>
        
        {/* Drawer Content */}
        <div className="flex-grow-1 p-0 overflow-hidden d-flex" style={{ background: 'linear-gradient(135deg, rgba(8,8,16,1) 0%, rgba(105,48,195,0.15) 50%, rgba(114,239,221,0.1) 100%)' }}>
          {drawerTab === 'code' ? (
            <div className="d-flex w-100 h-100 p-4">
              <div className="w-100 h-100 d-flex flex-column text-start glass-panel overflow-hidden" style={{ borderRadius: '16px', backgroundColor: 'rgba(5, 5, 5, 0.8)', border: '1px solid rgba(255,255,255,0.05)' }}>
                 <div className="px-4 py-3 border-bottom d-flex justify-content-between align-items-center" style={{ borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                   <div className="d-flex align-items-center gap-3">
                     <div className="d-flex gap-1">
                       <div className="rounded-circle" style={{ width: '12px', height: '12px', backgroundColor: '#ff5f56' }}></div>
                       <div className="rounded-circle" style={{ width: '12px', height: '12px', backgroundColor: '#ffbd2e' }}></div>
                       <div className="rounded-circle" style={{ width: '12px', height: '12px', backgroundColor: '#27c93f' }}></div>
                     </div>
                     <span className="text-muted font-monospace" style={{ fontSize: '0.85rem', letterSpacing: '1px' }}><i className="bi bi-filetype-py text-mint me-2"></i>main.py</span>
                   </div>
                   <button 
                     className="btn btn-sm btn-outline-mint d-flex align-items-center gap-2"
                     style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: '6px' }}
                     onClick={() => {
                       navigator.clipboard.writeText(globalCode);
                       alert('Code copied to clipboard!');
                     }}
                   >
                     <i className="bi bi-clipboard"></i> Copy
                   </button>
                 </div>
                 <div className="flex-grow-1 overflow-auto p-4 m-0 position-relative">
                   <pre className="m-0 font-monospace text-light" style={{ fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.9 }}>
                     {globalCode || '# Assemble the graph to generate code preview'}
                   </pre>
                 </div>
              </div>
            </div>
          ) : (
            <div className="d-flex w-100 h-100 p-4 gap-4">
               {/* Left: Chat input & Response */}
               <div className="d-flex flex-column w-50 h-100">
                  <div className="glass-panel p-3 mb-3 d-flex gap-3 align-items-center" style={{ borderRadius: '12px' }}>
                     <input 
                       type="text" 
                       className="form-control bg-transparent border-0 text-white shadow-none" 
                       placeholder="Enter message for agent..."
                       value={runMessage}
                       onChange={e => setRunMessage(e.target.value)}
                       onKeyDown={e => { if(e.key === 'Enter') handleRun(); }}
                       style={{ fontSize: '1.1rem' }}
                     />
                     <button className="btn btn-mint d-flex align-items-center justify-content-center rounded-circle p-0" style={{ width: '45px', height: '45px' }} onClick={handleRun} disabled={isExecuting}>
                       {isExecuting ? <span className="spinner-border spinner-border-sm text-dark"></span> : <i className="bi bi-send-fill fs-5"></i>}
                     </button>
                  </div>
                  <div className="flex-grow-1 overflow-auto glass-panel p-4 text-start d-flex flex-column" style={{ borderRadius: '16px', fontSize: '0.95rem' }}>
                     {runResponse ? (
                       <div>
                         <div className="d-flex align-items-center gap-2 mb-2">
                           <i className="bi bi-robot text-mint fs-5"></i>
                           <strong className="text-white font-monospace" style={{ letterSpacing: '1px' }}>AGENT</strong>
                         </div>
                         <pre className="text-light opacity-75" style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)', lineHeight: '1.7' }}>{runResponse}</pre>
                       </div>
                     ) : (
                       <div className="m-auto text-center opacity-50">
                         <i className="bi bi-chat-dots text-muted display-4 mb-3 d-block"></i>
                         <span className="text-muted" style={{ letterSpacing: '1px' }}>Agent response will appear here...</span>
                       </div>
                     )}
                  </div>
               </div>
               {/* Right: Logs */}
               <div className="w-50 h-100 d-flex flex-column text-start glass-panel overflow-hidden" style={{ borderRadius: '16px', backgroundColor: 'rgba(5, 5, 5, 0.8)' }}>
                 <div className="px-4 py-2 border-bottom d-flex align-items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                   <div className="d-flex gap-1">
                     <div className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: '#ff5f56' }}></div>
                     <div className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: '#ffbd2e' }}></div>
                     <div className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: '#27c93f' }}></div>
                   </div>
                   <span className="text-muted ms-3 font-monospace" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>execution_logs.sh</span>
                 </div>
                 <pre className="flex-grow-1 overflow-auto p-4 m-0 text-mint font-monospace" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                    {runLogs || 'Waiting for execution...'}
                 </pre>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div 
          className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center" 
          style={{ top: 0, left: 0, zIndex: 1050, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)' }}
        >
          <div className="glass-panel p-4" style={{ width: '600px', borderRadius: '15px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="text-white m-0">Export Web App</h4>
              <button className="btn-close btn-close-white" onClick={() => setShowExportModal(false)}></button>
            </div>
            
            <div className="mb-4">
              <label className="form-label text-info fw-bold">Select Template</label>
              <div className="d-flex gap-3">
                <div 
                  className={`card text-white flex-fill cursor-pointer ${exportTemplate === 'full_screen' ? 'border-info bg-primary' : 'bg-dark border-secondary'}`}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => setExportTemplate('full_screen')}
                >
                  <div className="card-body text-center py-4">
                    <i className="bi bi-window-fullscreen fs-1 mb-2"></i>
                    <h6>Full Screen Chat</h6>
                    <small className="text-muted d-block mt-2">Like ChatGPT</small>
                  </div>
                </div>
                <div 
                  className={`card text-white flex-fill cursor-pointer ${exportTemplate === 'widget' ? 'border-info bg-primary' : 'bg-dark border-secondary'}`}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => setExportTemplate('widget')}
                >
                  <div className="card-body text-center py-4">
                    <i className="bi bi-chat-square-dots-fill fs-1 mb-2"></i>
                    <h6>Floating Widget</h6>
                    <small className="text-muted d-block mt-2">Like Intercom</small>
                  </div>
                </div>
                <div 
                  className={`card text-white flex-fill cursor-pointer ${exportTemplate === 'raw' ? 'border-info bg-primary' : 'bg-dark border-secondary'}`}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => setExportTemplate('raw')}
                >
                  <div className="card-body text-center py-4">
                    <i className="bi bi-filetype-py fs-1 mb-2"></i>
                    <h6>Raw Python</h6>
                    <small className="text-muted d-block mt-2">SDK Script Only</small>
                  </div>
                </div>
              </div>
            </div>

            {exportTemplate !== 'raw' && (
              <div className="row mb-4">
                <div className="col-12 mb-3">
                  <label className="form-label text-info fw-bold">Theme Mode</label>
                  <select 
                    className="form-select bg-dark border-secondary text-white" 
                    value={exportTheme} 
                    onChange={(e) => setExportTheme(e.target.value)}
                  >
                    <option value="dark">Dark Mode</option>
                    <option value="light">Light Mode</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label text-info fw-bold d-flex justify-content-between">
                    Gradient Palette (3-5 Colors)
                    <div>
                      <button 
                        className="btn btn-sm btn-outline-success me-1" 
                        onClick={() => setExportGradientColors([...exportGradientColors, '#ffffff'])}
                        disabled={exportGradientColors.length >= 5}
                      >
                        <i className="bi bi-plus-circle"></i> Add
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => setExportGradientColors(exportGradientColors.slice(0, -1))}
                        disabled={exportGradientColors.length <= 3}
                      >
                        <i className="bi bi-dash-circle"></i> Remove
                      </button>
                    </div>
                  </label>
                  
                  <div className="d-flex gap-2 mb-3">
                    {exportGradientColors.map((color, index) => (
                      <div key={index} className="flex-fill position-relative">
                        <input 
                          type="color" 
                          className="form-control form-control-color bg-dark border-secondary w-100 p-1" 
                          value={color}
                          onChange={(e) => {
                            const newColors = [...exportGradientColors];
                            newColors[index] = e.target.value;
                            setExportGradientColors(newColors);
                          }}
                        />
                        <div className="text-center mt-1" style={{ fontSize: '0.7rem', color: '#aaa' }}>{color}</div>
                      </div>
                    ))}
                  </div>

                  {/* Live Gradient Preview Box */}
                  <div 
                    className="w-100 rounded" 
                    style={{ 
                      height: '40px', 
                      background: `linear-gradient(90deg, ${exportGradientColors.join(', ')})`,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                    }}
                  ></div>

                </div>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top border-secondary">
              <div>
                {exportTemplate !== 'raw' && (
                  <button 
                    className="btn btn-outline-info" 
                    onClick={handlePreviewTemplate}
                  >
                    <i className="bi bi-eye me-2"></i>
                    Live Preview
                  </button>
                )}
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary text-white" onClick={() => setShowExportModal(false)}>Cancel</button>
                <button className="btn btn-info glow-cyan px-4" onClick={handleDownload} disabled={isGenerating}>
                  {isGenerating ? <span className="spinner-border spinner-border-sm"></span> : 'Export ZIP'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkspaceEditor;
