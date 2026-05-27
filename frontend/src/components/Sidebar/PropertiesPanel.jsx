import React from 'react';

export const PropertiesPanel = ({ selectedNode, onUpdateNode, onDeleteNode }) => {
  if (!selectedNode) {
    return (
      <div 
        className="glass-panel p-3 h-100 d-flex align-items-center justify-content-center text-center text-muted"
        style={{ width: 'var(--sidebar-width)', zIndex: 10 }}
      >
        <div>
          <i className="bi bi-info-circle fs-3 mb-2 d-block"></i>
          <span>Select a node on the canvas to configure it</span>
        </div>
      </div>
    );
  }

  const { type, data } = selectedNode;

  // Handle value change
  const handleChange = (key, val) => {
    onUpdateNode(selectedNode.id, {
      ...data,
      [key]: val
    });
  };

  // Generate node-specific Python code preview
  const getCodePreview = () => {
    switch (type) {
      case 'agent':
        return `# Initialize Agent Core\nagent = Agent(\n    llm=llm,\n    memory=memory\n)`;
      case 'openai_llm':
        const model = data.model || 'gpt-4o';
        const apiKey = data.api_key ? `"${data.api_key}"` : '"your-api-key-here"';
        const urlStr = data.base_url ? `,\n    base_url="${data.base_url}"` : '';
        return `from phoenix.services.llm.openai import OpenAILLM\n\nllm = OpenAILLM(\n    model="${model}",\n    api_key=${apiKey}${urlStr}\n)`;
      case 'local_llm':
        return `from phoenix.services.llm.local import LocalLLM\n\nllm = LocalLLM()`;
      case 'hybrid_memory':
        return `from phoenix.framework.agent.memory.hybrid import HybridMemory\n\nmemory = HybridMemory()`;
      case 'default_tool':
        if (data.tool_type === 'web_search') {
          return `from phoenix.framework.agent.tools.search import WebSearchTool\n\n# Register tool\nagent.register_tool(WebSearchTool())`;
        } else {
          return `from phoenix.framework.agent.tools.code import CommandExecutionTool\n\n# Register tool\nagent.register_tool(CommandExecutionTool())`;
        }
      case 'custom_tool':
        const fnName = data.name || 'custom_tool';
        const code = data.code || `@tool(name="${fnName}", description="Custom tool.")\ndef ${fnName}(param: str):\n    return f"Processed {param}"`;
        return `# Custom tool registration\nfrom phoenix.framework.agent.tools.base import tool\n\n${code}\n\n# Register on agent\nagent.register_tool(${fnName})`;
      case 'chatbot':
        return `# ChatBot Orchestrator\nfrom phoenix.framework.chatbot.core import ChatBot\n\nbot = ChatBot(\n    tts=${data.tts_enabled ? 'True' : 'False'},\n    stt=${data.stt_enabled ? 'True' : 'False'}\n).with_system_prompt("${data.system_prompt || ''}").set_session("${data.session_id || 'default'}")`;
      case 'rag':
        return `# RAG Configuration\n.with_rag(\n    data_to_insight_path="${data.path || './data'}",\n    chunk_size=${data.chunk_size || 500},\n    chunk_overlap=${data.chunk_overlap || 50},\n    reranking=${data.reranking ? 'True' : 'False'},\n    fast_rag=${data.fast_rag ? 'True' : 'False'},\n    hybrid_search=${data.hybrid_search ? 'True' : 'False'},\n    cag=${data.cag ? 'True' : 'False'},\n    threshold=${data.threshold || 0.5},\n    device="${data.device || 'cpu'}"\n)`;
      case 'openai_vlm':
        const vlmModel = data.model || 'gpt-4o';
        const vlmKey = data.api_key ? `"${data.api_key}"` : '"your-api-key-here"';
        return `# VLM Config\n.with_model(vlm="${vlmModel}").with_openai(api_key=${vlmKey})`;
      case 'local_vlm':
        return `# Local VLM Config\n.with_model(vlm="${data.model || 'Qwen2-VL'}")`;
      case 'tts_node':
        return `# TTS Node enabled -> Passed to ChatBot constructor`;
      case 'stt_node':
        return `# STT Node enabled -> Passed to ChatBot constructor`;
      case 'api_export':
        return `# Export as Headless API\n# Using API Key: ${data.api_key || 'my_secure_api_key'}\nexport_as_api = True`;
      case 'github_repo':
        return `# GitHub Repository Ingestion\ndata_path = "${data.url || 'https://github.com/user/repo'}"`;
      case 'data_folder':
        return `# Local Folder Ingestion\ndata_path = "${data.path || './data'}"`;
      case 'web_data_api':
        return `# Web Data API Ingestion\ndata_path = "${data.url || 'https://api.example.com/data'}"`;
      default:
        return `# Standard node representation`;
    }
  };

  return (
    <div 
      className="glass-panel p-3 h-100 d-flex flex-column text-start"
      style={{
        width: 'var(--sidebar-width)',
        zIndex: 10,
        overflowY: 'auto'
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4" style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
        <h5 className="m-0 text-white d-flex align-items-center gap-2">
          <i className="bi bi-sliders text-info glow-cyan"></i> Config Properties
        </h5>
        <button 
          className="btn btn-sm btn-outline-danger"
          style={{ padding: '2px 8px', fontSize: '0.75rem', borderRadius: '6px' }}
          onClick={() => onDeleteNode(selectedNode.id)}
        >
          Delete
        </button>
      </div>

      <div style={{ flexGrow: 1 }}>
        {/* Render node-specific inputs */}
        {type === 'agent' && (
          <div className="d-flex flex-column gap-3 mb-4">
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Agent Name</label>
              <input 
                type="text" 
                className="form-control bg-dark border-secondary text-white"
                value={data.name || ''} 
                onChange={(e) => handleChange('name', e.target.value)} 
              />
            </div>
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Session ID</label>
              <input 
                type="text" 
                className="form-control bg-dark border-secondary text-white"
                value={data.session_id || ''} 
                onChange={(e) => handleChange('session_id', e.target.value)} 
              />
            </div>
          </div>
        )}

        {type === 'openai_llm' && (
          <div className="d-flex flex-column gap-3 mb-4">
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Model Name</label>
              <select 
                className="form-select bg-dark border-secondary text-white"
                value={data.model || 'gpt-4o'} 
                onChange={(e) => handleChange('model', e.target.value)}
              >
                <option value="gpt-4o">gpt-4o</option>
                <option value="gpt-4-turbo">gpt-4-turbo</option>
                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                <option value="LongCat-Flash-Lite">LongCat-Flash-Lite</option>
                <option value="LongCat-Flash-Chat">LongCat-Flash-Chat</option>
                <option value="LongCat-Flash-Thinking-2601">LongCat-Flash-Thinking-2601</option>
                <option value="LongCat-Flash-Omni-2603">LongCat-Flash-Omni-2603</option>
              </select>
            </div>
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>API Key</label>
              <input 
                type="password" 
                className="form-control bg-dark border-secondary text-white"
                placeholder="sk-..."
                value={data.api_key || ''} 
                onChange={(e) => handleChange('api_key', e.target.value)} 
              />
            </div>
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Base URL (Optional)</label>
              <input 
                type="text" 
                className="form-control bg-dark border-secondary text-white"
                placeholder="https://api.openai.com/v1"
                value={data.base_url || ''} 
                onChange={(e) => handleChange('base_url', e.target.value)} 
              />
            </div>
          </div>
        )}

        {type === 'local_llm' && (
          <div className="d-flex flex-column gap-3 mb-4">
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Model Name</label>
              <input 
                type="text" 
                className="form-control bg-dark border-secondary text-white"
                value={data.model || ''} 
                onChange={(e) => handleChange('model', e.target.value)} 
              />
            </div>
          </div>
        )}

        {type === 'hybrid_memory' && (
          <div className="mb-4">
            <span className="text-muted d-block mb-2" style={{ fontSize: '0.8rem' }}>Redis persistence caching is enabled by default for hybrid memory layers.</span>
          </div>
        )}

        {type === 'default_tool' && (
          <div className="mb-4">
            <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Tool Name</label>
            <input 
              type="text" 
              className="form-control bg-dark border-secondary text-white"
              disabled
              value={data.name || ''} 
            />
          </div>
        )}

        {type === 'custom_tool' && (
          <div className="d-flex flex-column gap-3 mb-4">
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Tool Function Name</label>
              <input 
                type="text" 
                className="form-control bg-dark border-secondary text-white"
                value={data.name || ''} 
                onChange={(e) => handleChange('name', e.target.value)} 
              />
            </div>
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Python Function Code</label>
              <textarea 
                className="form-control bg-dark border-secondary text-white font-monospace"
                style={{ fontSize: '0.75rem', height: '220px' }}
                value={data.code || ''} 
                onChange={(e) => handleChange('code', e.target.value)} 
              />
            </div>
          </div>
        )}

        {type === 'chatbot' && (
          <div className="d-flex flex-column gap-3 mb-4">
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Session ID</label>
              <input 
                type="text" 
                className="form-control bg-dark border-secondary text-white"
                value={data.session_id || ''} 
                onChange={(e) => handleChange('session_id', e.target.value)} 
              />
            </div>
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>System Prompt</label>
              <textarea 
                className="form-control bg-dark border-secondary text-white"
                style={{ fontSize: '0.85rem', height: '100px' }}
                value={data.system_prompt || ''} 
                onChange={(e) => handleChange('system_prompt', e.target.value)} 
              />
            </div>
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Security Mode</label>
              <select 
                className="form-select bg-dark border-secondary text-white"
                value={data.security_mode || 'standard'} 
                onChange={(e) => handleChange('security_mode', e.target.value)}
              >
                <option value="none">Disabled</option>
                <option value="standard">Standard</option>
                <option value="strict">Strict</option>
              </select>
            </div>
            <div className="form-check form-switch mt-2">
              <input 
                className="form-check-input" 
                type="checkbox" 
                role="switch" 
                checked={data.tts_enabled || false}
                onChange={(e) => handleChange('tts_enabled', e.target.checked)}
              />
              <label className="form-check-label text-light" style={{ fontSize: '0.85rem' }}>Enable Text-to-Speech (TTS)</label>
            </div>
            <div className="form-check form-switch">
              <input 
                className="form-check-input" 
                type="checkbox" 
                role="switch" 
                checked={data.stt_enabled || false}
                onChange={(e) => handleChange('stt_enabled', e.target.checked)}
              />
              <label className="form-check-label text-light" style={{ fontSize: '0.85rem' }}>Enable Speech-to-Text (STT)</label>
            </div>
          </div>
        )}

        {type === 'rag' && (
          <div className="d-flex flex-column gap-3 mb-4">
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Data Path</label>
              <input 
                type="text" 
                className="form-control bg-dark border-secondary text-white"
                value={data.path || ''} 
                onChange={(e) => handleChange('path', e.target.value)} 
                placeholder="./data"
              />
            </div>
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Chunk Size</label>
              <input 
                type="number" 
                className="form-control bg-dark border-secondary text-white"
                value={data.chunk_size || 500} 
                onChange={(e) => handleChange('chunk_size', parseInt(e.target.value) || 500)} 
              />
            </div>
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Chunk Overlap</label>
              <input 
                type="number" 
                className="form-control bg-dark border-secondary text-white"
                value={data.chunk_overlap || 50} 
                onChange={(e) => handleChange('chunk_overlap', parseInt(e.target.value) || 50)} 
              />
            </div>
            <div className="form-check form-switch mt-2">
              <input 
                className="form-check-input" 
                type="checkbox" 
                role="switch" 
                checked={data.reranking || false}
                onChange={(e) => handleChange('reranking', e.target.checked)}
              />
              <label className="form-check-label text-light" style={{ fontSize: '0.85rem' }}>Enable Reranking</label>
            </div>
            <div className="form-check form-switch">
              <input 
                className="form-check-input" 
                type="checkbox" 
                role="switch" 
                checked={data.fast_rag || false}
                onChange={(e) => handleChange('fast_rag', e.target.checked)}
              />
              <label className="form-check-label text-light" style={{ fontSize: '0.85rem' }}>Fast RAG Mode</label>
            </div>
            <div className="form-check form-switch">
              <input 
                className="form-check-input" 
                type="checkbox" 
                role="switch" 
                checked={data.hybrid_search || false}
                onChange={(e) => handleChange('hybrid_search', e.target.checked)}
              />
              <label className="form-check-label text-light" style={{ fontSize: '0.85rem' }}>Hybrid Search (BM25 + Semantic)</label>
            </div>
            <div className="form-check form-switch">
              <input 
                className="form-check-input" 
                type="checkbox" 
                role="switch" 
                checked={data.cag || false}
                onChange={(e) => handleChange('cag', e.target.checked)}
              />
              <label className="form-check-label text-light" style={{ fontSize: '0.85rem' }}>Cache-Augmented Generation (CAG)</label>
            </div>
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Similarity Threshold</label>
              <input 
                type="number" 
                step="0.01"
                className="form-control bg-dark border-secondary text-white"
                value={data.threshold || 0.5} 
                onChange={(e) => handleChange('threshold', parseFloat(e.target.value) || 0.5)} 
              />
            </div>
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Device</label>
              <select 
                className="form-select bg-dark border-secondary text-white"
                value={data.device || 'cpu'} 
                onChange={(e) => handleChange('device', e.target.value)}
              >
                <option value="cpu">CPU</option>
                <option value="cuda">CUDA (GPU)</option>
                <option value="mps">MPS (Mac)</option>
              </select>
            </div>
          </div>
        )}

        {type === 'openai_vlm' && (
          <div className="d-flex flex-column gap-3 mb-4">
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>VLM Model</label>
              <input 
                type="text" 
                className="form-control bg-dark border-secondary text-white"
                value={data.model || 'gpt-4o'} 
                onChange={(e) => handleChange('model', e.target.value)} 
              />
            </div>
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>API Key</label>
              <input 
                type="password" 
                className="form-control bg-dark border-secondary text-white"
                placeholder="sk-..."
                value={data.api_key || ''} 
                onChange={(e) => handleChange('api_key', e.target.value)} 
              />
            </div>
          </div>
        )}

        {type === 'local_vlm' && (
          <div className="d-flex flex-column gap-3 mb-4">
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Local VLM Model</label>
              <input 
                type="text" 
                className="form-control bg-dark border-secondary text-white"
                value={data.model || ''} 
                onChange={(e) => handleChange('model', e.target.value)} 
              />
            </div>
          </div>
        )}

        {(type === 'tts_node' || type === 'stt_node') && (
          <div className="mb-4">
            <span className="text-muted d-block mb-2" style={{ fontSize: '0.8rem' }}>Enable this feature on the ChatBot core.</span>
          </div>
        )}

        {type === 'api_export' && (
          <div className="d-flex flex-column gap-3 mb-4">
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Secure API Key</label>
              <input 
                type="text" 
                className="form-control bg-dark border-secondary text-white"
                value={data.api_key || ''} 
                onChange={(e) => handleChange('api_key', e.target.value)} 
              />
            </div>
            <div className="mt-2">
              <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                Connect ChatBot Output to this node to export a headless API server instead of the standard UI.
              </span>
            </div>
          </div>
        )}

        {type === 'github_repo' && (
          <div className="d-flex flex-column gap-3 mb-4">
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>GitHub URL</label>
              <input 
                type="text" 
                className="form-control bg-dark border-secondary text-white"
                placeholder="https://github.com/user/repo"
                value={data.url || ''} 
                onChange={(e) => handleChange('url', e.target.value)} 
              />
            </div>
          </div>
        )}

        {type === 'data_folder' && (
          <div className="d-flex flex-column gap-3 mb-4">
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>Folder Path</label>
              <input 
                type="text" 
                className="form-control bg-dark border-secondary text-white"
                placeholder="./data"
                value={data.path || ''} 
                onChange={(e) => handleChange('path', e.target.value)} 
              />
            </div>
          </div>
        )}

        {type === 'web_data_api' && (
          <div className="d-flex flex-column gap-3 mb-4">
            <div>
              <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.8rem' }}>API Endpoint URL</label>
              <input 
                type="text" 
                className="form-control bg-dark border-secondary text-white"
                placeholder="https://api.example.com/data"
                value={data.url || ''} 
                onChange={(e) => handleChange('url', e.target.value)} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Node Code Preview Section */}
      <div className="mt-auto pt-3" style={{ borderTop: '1px solid var(--glass-border)' }}>
        <span 
          className="text-uppercase font-title text-muted fw-bold d-block mb-2" 
          style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
        >
          Node Python Code
        </span>
        <pre 
          className="p-2 bg-dark rounded border border-secondary text-info font-monospace text-start"
          style={{ 
            fontSize: '0.72rem', 
            overflowX: 'auto',
            maxHeight: '180px',
            background: '#090912 !important'
          }}
        >
          {getCodePreview()}
        </pre>
      </div>
    </div>
  );
};
export default PropertiesPanel;
