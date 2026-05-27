import React, { useState, useCallback, useEffect, useContext } from 'react';
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
  data_source: CustomNode
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
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  // Export Modal State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportTemplate, setExportTemplate] = useState('raw'); // 'raw', 'full_screen', 'widget'
  const [exportPrimaryColor, setExportPrimaryColor] = useState('#00f2fe');
  const [exportTheme, setExportTheme] = useState('dark'); // 'dark' or 'light'

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

  // Handle ZIP generate download
  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const payload = {
        nodes,
        edges,
        template_type: exportTemplate,
        primary_color: exportPrimaryColor,
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

      {/* Main Navbar */}
      <nav
        className="navbar navbar-expand-lg glass-panel py-2 px-4 position-absolute"
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
          <a className="navbar-brand d-flex align-items-center text-decoration-none" href="#">
            <button className="btn btn-link text-info p-0 me-3" onClick={() => navigate('/dashboard')} title="Back to Dashboard">
              <i className="bi bi-arrow-left fs-4"></i>
            </button>
            <i className="bi bi-fire text-info me-2 fs-3 glow-cyan"></i>
            <span
              style={{
                fontFamily: 'var(--font-title)',
                fontWeight: 700,
                fontSize: '1.4rem',
                letterSpacing: '1px',
                color: 'white',
              }}
            >
              PHOENIX <span className="text-info glow-cyan">STUDIO</span>
            </span>
            <span className="ms-3 text-secondary">|</span>
            <span className="ms-3 text-light fw-semibold">{workspaceName}</span>
          </a>

          <div className="d-flex align-items-center gap-3">
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
              <i className="bi bi-code-square"></i>
              Show Code
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
              <i className="bi bi-play-fill text-success"></i>
              Run Flow
            </button>

            <button
              className="btn btn-info d-flex align-items-center gap-2"
              style={{
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)',
                border: 'none',
                color: '#080810',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                padding: '8px 20px',
                boxShadow: '0 0 15px rgba(0, 242, 254, 0.3)',
              }}
              onClick={() => setShowExportModal(true)}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Building...
                </>
              ) : (
                <>
                  <i className="bi bi-download"></i>
                  Download Agent
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Workspace Panel */}
      <div 
        className="d-flex w-100" 
        style={{ 
          height: `calc(100vh - ${showCodeDrawer ? '300px' : '0px'})`, 
          paddingTop: '95px',
          transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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
          <BlocksPanel onAddNode={onAddNode} />
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

            <button 
              className="btn btn-sm btn-outline-info position-absolute"
              style={{ top: '15px', right: '15px', zIndex: 10, background: 'rgba(0,0,0,0.5)', border: '1px solid var(--accent-cyan)' }}
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
              title="Toggle Properties Panel"
            >
              <i className={`bi ${rightSidebarOpen ? 'bi-chevron-right' : 'bi-sliders'}`}></i>
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

        {/* Right Side: Properties panel */}
        <div 
          className="p-3 pl-0" 
          style={{ 
            height: '100%', 
            width: rightSidebarOpen ? '320px' : '0px', 
            overflow: 'hidden', 
            opacity: rightSidebarOpen ? 1 : 0, 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            padding: rightSidebarOpen ? '' : '0 !important'
          }}
        >
          <PropertiesPanel 
            selectedNode={selectedNode}
            onUpdateNode={onUpdateNode}
            onDeleteNode={onDeleteNode}
          />
        </div>
      </div>

      {/* Bottom Collapsible Global Code Preview Drawer */}
      <div
        className="glass-panel position-absolute"
        style={{
          bottom: '15px',
          left: '15px',
          right: '15px',
          height: '280px',
          zIndex: 90,
          borderRadius: '12px',
          transform: showCodeDrawer ? 'translateY(0)' : 'translateY(310px)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'left'
        }}
      >
        {/* Header of Drawer */}
        <div className="d-flex justify-content-between align-items-center px-4 py-2" style={{ borderBottom: '1px solid var(--glass-border)' }}>
          <span className="fw-semibold text-white d-flex align-items-center gap-2" style={{ fontFamily: 'var(--font-title)', fontSize: '0.95rem' }}>
            {drawerTab === 'code' ? (
              <><i className="bi bi-file-earmark-code text-info glow-cyan"></i> generated_project / main.py</>
            ) : (
              <><i className="bi bi-terminal-fill text-success glow-green"></i> Live Execution Console</>
            )}
          </span>
          {drawerTab === 'code' && (
            <button 
              className="btn btn-sm btn-outline-info"
              style={{ fontSize: '0.75rem', padding: '2px 10px', borderRadius: '6px' }}
              onClick={() => {
                navigator.clipboard.writeText(globalCode);
                alert('Code copied to clipboard!');
              }}
            >
              Copy Code
            </button>
          )}
        </div>
        
        {/* Drawer Content */}
        <div className="flex-grow-1 p-0 overflow-hidden d-flex" style={{ background: '#07070e' }}>
          {drawerTab === 'code' ? (
            <div className="p-3 w-100 h-100 overflow-auto">
              <pre className="m-0 font-monospace text-info" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                {globalCode || '# Assemble the graph to generate code preview'}
              </pre>
            </div>
          ) : (
            <div className="d-flex w-100 h-100">
               {/* Left: Chat input & Response */}
               <div className="d-flex flex-column border-end border-secondary w-50 p-3 h-100">
                  <div className="d-flex gap-2 mb-3">
                     <input 
                       type="text" 
                       className="form-control bg-dark border-secondary text-white" 
                       placeholder="Enter message for agent..."
                       value={runMessage}
                       onChange={e => setRunMessage(e.target.value)}
                       onKeyDown={e => { if(e.key === 'Enter') handleRun(); }}
                     />
                     <button className="btn btn-success d-flex align-items-center" onClick={handleRun} disabled={isExecuting}>
                       {isExecuting ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-send-fill"></i>}
                     </button>
                  </div>
                  <div className="flex-grow-1 overflow-auto bg-dark p-2 rounded border border-secondary text-white text-start" style={{fontSize: '0.85rem'}}>
                     {runResponse ? (
                       <div><strong className="text-info">Agent:</strong><br/><pre style={{whiteSpace: 'pre-wrap', fontFamily: 'inherit'}}>{runResponse}</pre></div>
                     ) : (
                       <span className="text-muted">Agent response will appear here...</span>
                     )}
                  </div>
               </div>
               {/* Right: Logs */}
               <div className="w-50 p-3 h-100 d-flex flex-column text-start">
                 <span className="text-muted mb-2 fw-bold" style={{fontSize: '0.75rem'}}>Execution Logs</span>
                 <pre className="flex-grow-1 overflow-auto bg-dark p-2 rounded border border-secondary text-success font-monospace" style={{fontSize: '0.75rem'}}>
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
                <div className="col-6">
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
                <div className="col-6">
                  <label className="form-label text-info fw-bold">Primary Color</label>
                  <div className="d-flex align-items-center gap-2">
                    <input 
                      type="color" 
                      className="form-control form-control-color bg-dark border-secondary p-1" 
                      value={exportPrimaryColor} 
                      title="Choose your color"
                      onChange={(e) => setExportPrimaryColor(e.target.value)}
                    />
                    <span className="text-white font-monospace">{exportPrimaryColor}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top border-secondary">
              <button className="btn btn-outline-secondary text-white" onClick={() => setShowExportModal(false)}>Cancel</button>
              <button className="btn btn-info glow-cyan px-4" onClick={handleDownload} disabled={isGenerating}>
                {isGenerating ? <span className="spinner-border spinner-border-sm"></span> : 'Export ZIP'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkspaceEditor;
