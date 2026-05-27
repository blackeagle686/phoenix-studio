import React from 'react';
import { Handle, Position } from 'reactflow';

export const CustomNode = ({ data, type, selected }) => {
  // Determine styles based on node type
  let title = 'Node';
  let icon = 'bi-gear';
  let colorVar = '--accent-cyan';
  let showInputHandle = false;
  let showOutputHandle = false;
  let desc = '';

  switch (type) {
    case 'agent':
      title = 'Agent Core';
      icon = 'bi-cpu-fill';
      colorVar = '--accent-cyan';
      showInputHandle = true; // Inputs from LLM, Memory, Tools
      showOutputHandle = false;
      desc = data.name ? `Name: ${data.name}` : 'Phoenix Agent core loop';
      break;
    case 'openai_llm':
      title = 'OpenAI LLM';
      icon = 'bi-cloud-lightning-fill';
      colorVar = '--accent-purple';
      showInputHandle = false;
      showOutputHandle = true; // Connects to agent
      desc = `Model: ${data.model || 'gpt-4o'}`;
      break;
    case 'local_llm':
      title = 'Local LLM';
      icon = 'bi-pc-display';
      colorVar = '--accent-blue';
      showInputHandle = false;
      showOutputHandle = true; // Connects to agent
      desc = `Model: ${data.model || 'Qwen-1.5B'}`;
      break;
    case 'hybrid_memory':
      title = 'Hybrid Memory';
      icon = 'bi-hdd-network-fill';
      colorVar = '--accent-pink';
      showInputHandle = false;
      showOutputHandle = true; // Connects to agent
      desc = 'STM, LTM & Redis Sync';
      break;
    case 'default_tool':
      title = 'Default Tool';
      icon = 'bi-tools';
      colorVar = '--accent-green';
      showInputHandle = false;
      showOutputHandle = true; // Connects to agent
      desc = `Type: ${data.tool_type === 'web_search' ? 'Web Search' : 'Command Exec'}`;
      break;
    case 'custom_tool':
      title = 'Custom Tool';
      icon = 'bi-code-slash';
      colorVar = '--accent-green';
      showInputHandle = false;
      showOutputHandle = true; // Connects to agent
      desc = `Name: ${data.name || 'custom_fn'}`;
      break;
    default:
      break;
  }

  const borderGlow = selected 
    ? `0 0 20px var(${colorVar})` 
    : '0 4px 15px rgba(0, 0, 0, 0.4)';

  return (
    <div
      className="glass-panel px-3 py-2 text-start"
      style={{
        border: selected ? `2px solid var(${colorVar})` : `1px solid rgba(255, 255, 255, 0.1)`,
        boxShadow: borderGlow,
        borderRadius: '12px',
        width: '240px',
        background: 'var(--glass-bg)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
    >
      {showInputHandle && (
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: `var(${colorVar})`, top: '50%' }}
        />
      )}

      <div className="d-flex align-items-center gap-2 mb-1">
        <div 
          className="d-flex align-items-center justify-content-center" 
          style={{ 
            color: `var(${colorVar})`, 
            fontSize: '1.25rem',
            textShadow: `0 0 10px var(${colorVar})`
          }}
        >
          <i className={`bi ${icon}`}></i>
        </div>
        <div style={{ flexGrow: 1 }}>
          <h6 className="m-0 text-white" style={{ fontSize: '0.95rem', fontWeight: 600 }}>
            {title}
          </h6>
        </div>
      </div>

      <p className="m-0 text-muted" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {desc}
      </p>

      {showOutputHandle && (
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: `var(${colorVar})`, top: '50%' }}
        />
      )}
    </div>
  );
};
export default CustomNode;
