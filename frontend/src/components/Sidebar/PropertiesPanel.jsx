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
