import React from 'react';

const blockCategories = [
  {
    title: 'Core Engine',
    items: [
      {
        type: 'agent',
        name: 'Agent Core',
        icon: 'bi-cpu-fill',
        color: 'var(--accent-cyan)',
        desc: 'Main agent loop block.',
        defaultData: { name: 'MyAgent', session_id: 'default' }
      }
    ]
  },
  {
    title: 'Cognitive Models',
    items: [
      {
        type: 'openai_llm',
        name: 'OpenAI LLM',
        icon: 'bi-cloud-lightning-fill',
        color: 'var(--accent-purple)',
        desc: 'GPT-4o or remote endpoints.',
        defaultData: { model: 'gpt-4o', api_key: '', base_url: '' }
      },
      {
        type: 'local_llm',
        name: 'Local LLM',
        icon: 'bi-pc-display',
        color: 'var(--accent-blue)',
        desc: 'Local Qwen models.',
        defaultData: { model: 'Qwen/Qwen2-1.5B-Instruct' }
      }
    ]
  },
  {
    title: 'Memory Storage',
    items: [
      {
        type: 'hybrid_memory',
        name: 'Hybrid Memory',
        icon: 'bi-hdd-network-fill',
        color: 'var(--accent-pink)',
        desc: 'STM + LTM vector store.',
        defaultData: { use_redis: true }
      }
    ]
  },
  {
    title: 'Default & Custom Tools',
    items: [
      {
        type: 'default_tool',
        name: 'Web Search',
        icon: 'bi-search',
        color: 'var(--accent-green)',
        desc: 'DuckDuckGo search tool.',
        defaultData: { name: 'web_search', tool_type: 'web_search' }
      },
      {
        type: 'default_tool',
        name: 'Command Exec',
        icon: 'bi-terminal-fill',
        color: 'var(--accent-green)',
        desc: 'Run shell commands.',
        defaultData: { name: 'command_exec', tool_type: 'command' }
      },
      {
        type: 'custom_tool',
        name: 'Custom Tool',
        icon: 'bi-code-slash',
        color: 'var(--accent-green)',
        desc: 'Write custom Python code.',
        defaultData: { 
          name: 'custom_tool', 
          code: `@tool(name="custom_tool", description="Custom greeting.")\ndef custom_tool(name: str):\n    return f"Hello, {name}!"` 
        }
      }
    ]
  }
];

export const BlocksPanel = ({ onAddNode }) => {
  return (
    <div 
      className="glass-panel p-3 h-100 d-flex flex-column"
      style={{
        width: 'var(--sidebar-width)',
        zIndex: 10,
        overflowY: 'auto'
      }}
    >
      <h5 className="mb-4 text-white d-flex align-items-center gap-2" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
        <i className="bi bi-grid-fill text-info glow-cyan"></i> Blocks Panel
      </h5>
      
      {blockCategories.map((cat, idx) => (
        <div key={idx} className="mb-4 text-start">
          <span 
            className="text-uppercase font-title text-muted fw-bold d-block mb-2" 
            style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
          >
            {cat.title}
          </span>
          <div className="d-flex flex-column gap-2">
            {cat.items.map((item, itemIdx) => (
              <button
                key={itemIdx}
                className="btn w-100 d-flex align-items-start gap-2 p-2 border-0 text-start"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                  transition: 'background-color 0.2s, transform 0.2s',
                  color: 'var(--text-primary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
                onClick={() => onAddNode(item.type, item.defaultData)}
              >
                <div 
                  className="d-flex align-items-center justify-content-center p-2 rounded-3"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: item.color,
                    fontSize: '1.1rem'
                  }}
                >
                  <i className={`bi ${item.icon}`}></i>
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="fw-semibold text-white" style={{ fontSize: '0.85rem' }}>{item.name}</div>
                  <div className="text-muted text-truncate" style={{ fontSize: '0.7rem' }}>{item.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
export default BlocksPanel;
