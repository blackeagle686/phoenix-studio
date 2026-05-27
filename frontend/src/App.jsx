import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import './App.css';

// Initial placeholder nodes
const initialNodes = [
  {
    id: 'agent-1',
    type: 'default',
    data: { label: '🤖 Agent Core (Phoenix)' },
    position: { x: 350, y: 200 },
    style: {
      background: 'rgba(21, 21, 40, 0.8)',
      color: '#f5f6fa',
      border: '1px solid var(--accent-cyan)',
      boxShadow: '0 0 15px rgba(0, 242, 254, 0.25)',
      borderRadius: '8px',
      padding: '10px 15px',
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  {
    id: 'llm-1',
    type: 'input',
    data: { label: '🔌 OpenAILLM (gpt-4o)' },
    position: { x: 100, y: 100 },
    style: {
      background: 'rgba(21, 21, 40, 0.8)',
      color: '#f5f6fa',
      border: '1px solid var(--accent-purple)',
      boxShadow: '0 0 15px rgba(155, 81, 224, 0.25)',
      borderRadius: '8px',
      padding: '10px 15px',
      fontSize: '14px',
      fontWeight: '500',
    },
  },
  {
    id: 'mem-1',
    type: 'input',
    data: { label: '💾 HybridMemory (Redis)' },
    position: { x: 100, y: 300 },
    style: {
      background: 'rgba(21, 21, 40, 0.8)',
      color: '#f5f6fa',
      border: '1px solid var(--accent-pink)',
      boxShadow: '0 0 15px rgba(240, 147, 251, 0.25)',
      borderRadius: '8px',
      padding: '10px 15px',
      fontSize: '14px',
      fontWeight: '500',
    },
  },
];

const initialEdges = [
  { id: 'e-llm-agent', source: 'llm-1', target: 'agent-1', animated: true },
  { id: 'e-mem-agent', source: 'mem-1', target: 'agent-1', animated: true },
];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Ambient background orbs */}
      <div className="ambient-bg"></div>

      {/* Header / Navbar */}
      <nav
        className="navbar navbar-expand-lg glass-panel py-3 px-4 position-absolute w-100"
        style={{
          top: '15px',
          left: '15px',
          right: '15px',
          width: 'calc(100% - 30px)',
          zIndex: 1000,
          borderRadius: '12px',
        }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <a className="navbar-brand d-flex align-items-center text-decoration-none" href="#">
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
          </a>

          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-outline-info d-flex align-items-center gap-2"
              style={{
                borderRadius: '8px',
                border: '1px solid var(--accent-cyan)',
                background: 'transparent',
                color: 'var(--accent-cyan)',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                padding: '6px 16px',
              }}
              onClick={() => alert('Download pipeline configured in Phase 4.')}
            >
              <i className="bi bi-download"></i>
              Download Agent
            </button>
          </div>
        </div>
      </nav>

      {/* Canvas Area */}
      <div style={{ width: '100%', height: '100%', paddingTop: '0px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background color="#5c5d73" gap={16} size={1} />
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;
