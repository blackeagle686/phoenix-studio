import React from 'react';

// create_node this will used in the near future that we will add an agent that hanlde with users prompts to create custome nodes or edit
const 

const blockCategories = [
  {
    title: 'Core Engine',
    mode: 'agent',
    items: [
      {
        type: 'agent',
        name: 'Phoenix Agent Basic',
        icon: 'bi-cpu-fill',
        color: 'var(--accent-cyan)',
        desc: 'Main agent loop block.',
        defaultData: { name: 'MyAgent', session_id: 'default' }
      }
    ]
  },
  {
    title: 'ChatBot Framework',
    mode: 'chatbot',
    items: [
      {
        type: 'chatbot',
        name: 'ChatBot Core',
        icon: 'bi-chat-left-dots-fill',
        color: 'var(--accent-cyan)',
        desc: 'Main chatbot orchestrator.',
        defaultData: { session_id: 'default', system_prompt: 'You are a helpful assistant.', security_mode: 'standard', tts_enabled: false, stt_enabled: false }
      },
      {
        type: 'rag',
        name: 'RAG Pipeline',
        icon: 'bi-database-fill-gear',
        color: 'var(--accent-purple)',
        desc: 'Document ingestion configuration.',
        defaultData: { chunk_size: 500, chunk_overlap: 50 }
      },
      {
        type: 'api_export',
        name: 'API Export',
        icon: 'bi-cloud-arrow-up-fill',
        color: 'var(--accent-blue)',
        desc: 'Export ChatBot as headless API.',
        defaultData: { api_key: 'my_secure_api_key' }
      },
      {
        type: 'tts_node',
        name: 'Text-to-Speech',
        icon: 'bi-megaphone-fill',
        color: 'var(--accent-pink)',
        desc: 'Audio Output Configuration.',
        defaultData: { enabled: true }
      },
      {
        type: 'stt_node',
        name: 'Speech-to-Text',
        icon: 'bi-mic-fill',
        color: 'var(--accent-pink)',
        desc: 'Audio Input Configuration.',
        defaultData: { enabled: true }
      }
    ]
  },
  {
    title: 'Data Sources',
    mode: 'chatbot',
    items: [
      {
        type: 'github_repo',
        name: 'GitHub Repo',
        icon: 'bi-github',
        color: 'var(--accent-green)',
        desc: 'Ingest GitHub repository.',
        defaultData: { url: 'https://github.com/blackeagle686/phx-quantum' }
      },
      {
        type: 'data_folder',
        name: 'Data Folder',
        icon: 'bi-folder-fill',
        color: 'var(--accent-green)',
        desc: 'Ingest local folder.',
        defaultData: { path: './data' }
      },
      {
        type: 'web_data_api',
        name: 'Web Data API',
        icon: 'bi-globe2',
        color: 'var(--accent-green)',
        desc: 'Ingest JSON from API.',
        defaultData: { url: 'https://api.example.com/data' }
      }
    ]
  },
  {
    title: 'Cognitive Models',
    mode: 'shared',
    items: [
      {
        type: 'openai_llm',
        name: 'LLM Provider',
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
      },
      {
        type: 'openai_vlm',
        name: 'OpenAI VLM',
        icon: 'bi-eye-fill',
        color: 'var(--accent-purple)',
        desc: 'GPT-4o Vision or similar.',
        defaultData: { model: 'gpt-4o', api_key: '' }
      },
      {
        type: 'local_vlm',
        name: 'Local VLM',
        icon: 'bi-eye-fill',
        color: 'var(--accent-blue)',
        desc: 'Local Vision Model.',
        defaultData: { model: 'Qwen/Qwen2-VL-7B-Instruct' }
      }
    ]
  },
  {
    title: 'Memory Storage',
    mode: 'agent',
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
    title: 'Tools',
    mode: 'agent',
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

export const BlocksPanel = ({ onAddNode, workspaceMode = 'chatbot' }) => {
  return (
    <div 
      className="glass-panel h-100 d-flex flex-column overflow-hidden "
      style={{
        width: 'var(--sidebar-width)',
        zIndex: 10,
        backgroundColor: 'rgba(5, 5, 5, 0.6)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        borderTop: 'none', borderBottom: 'none', borderLeft: 'none',
        borderRadius: 0,
        backdropFilter: 'blur(20px)'
      }}
    >
      <div className="p-4 border-bottom" style={{ borderColor: 'rgba(255,255,255,0.05) !important', backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <h5 className="m-0 text-white fw-bold d-flex align-items-center gap-2" style={{ fontFamily: 'var(--font-title)', letterSpacing: '0.5px' }}>
          <i className="bi bi-box-seam text-mint fs-4"></i> Block Library
        </h5>
        <p className="text-muted small m-0 mt-2">Click to add logic nodes to canvas.</p>
      </div>
      
      <div className="p-3 pe-4 flex-grow-1 overflow-auto" style={{ paddingBottom: '100px' }}>
        {blockCategories
          .filter(cat => cat.mode === 'shared' || cat.mode === workspaceMode)
          .map((cat, idx) => (
          <div key={idx} className="mb-4 text-start">
            <span 
              className="text-uppercase font-title text-muted fw-bold d-block mb-3 px-2" 
              style={{ fontSize: '0.75rem', letterSpacing: '1px' }}
            >
              {cat.title}
            </span>
            <div className="d-flex flex-column gap-2">
              {cat.items.map((item, itemIdx) => (
                <button
                  key={itemIdx}
                  className="btn w-100 d-flex align-items-center gap-3 p-3 border-0 text-start position-relative overflow-hidden"
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '12px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    color: 'var(--text-primary)',
                    border: '1px solid rgba(255,255,255,0.02)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.border = `1px solid ${item.color}`;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    // Use a generic shadow since the color is a var string
                    e.currentTarget.style.boxShadow = `0 5px 15px rgba(255,255,255,0.05)`; 
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.02)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => onAddNode(item.type, item.defaultData)}
                >
                  <div 
                    className="d-flex align-items-center justify-content-center rounded flex-shrink-0"
                    style={{
                      width: '38px', height: '38px',
                      background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.0) 100%)`,
                      border: `1px solid ${item.color}`,
                      color: item.color,
                      fontSize: '1.1rem'
                    }}
                  >
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="fw-bold text-white mb-1" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>{item.name}</div>
                    <div className="text-muted text-truncate" style={{ fontSize: '0.75rem', opacity: 0.8 }}>{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default BlocksPanel;
