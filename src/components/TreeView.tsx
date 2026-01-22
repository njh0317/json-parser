import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Theme } from '../types';

interface TreeViewProps {
  data: unknown;
  theme: Theme;
}

interface TreeNodeProps {
  keyName: string;
  value: unknown;
  depth: number;
}

function TreeNode({ keyName, value, depth }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2);

  const getType = (val: unknown): string => {
    if (val === null) return 'null';
    if (Array.isArray(val)) return 'array';
    return typeof val;
  };

  const type = getType(value);
  const isExpandable = type === 'object' || type === 'array';
  const indent = depth * 16;

  const renderValue = () => {
    if (value === null) return <span className="text-gray-500">null</span>;
    if (type === 'string') return <span className="text-green-600 dark:text-green-400">"{String(value)}"</span>;
    if (type === 'number') return <span className="text-blue-600 dark:text-blue-400">{String(value)}</span>;
    if (type === 'boolean') return <span className="text-purple-600 dark:text-purple-400">{String(value)}</span>;
    return null;
  };

  if (!isExpandable) {
    return (
      <div className="flex items-center py-0.5" style={{ paddingLeft: indent }}>
        <span className="text-gray-700 dark:text-gray-300 mr-1">{keyName}:</span>
        {renderValue()}
      </div>
    );
  }

  const entries = type === 'array' 
    ? (value as unknown[]).map((v, i) => [String(i), v] as [string, unknown])
    : Object.entries(value as Record<string, unknown>);

  return (
    <div>
      <div
        className="flex items-center py-0.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
        style={{ paddingLeft: indent }}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span className="text-gray-700 dark:text-gray-300 ml-1">{keyName}</span>
        <span className="text-gray-500 ml-1">
          {type === 'array' ? `[${entries.length}]` : `{${entries.length}}`}
        </span>
      </div>
      {expanded && entries.map(([k, v]) => (
        <TreeNode key={k} keyName={k} value={v} depth={depth + 1} />
      ))}
    </div>
  );
}

export function TreeView({ data }: TreeViewProps) {
  return (
    <div className="p-2 font-mono text-sm overflow-auto h-full">
      <TreeNode keyName="root" value={data} depth={0} />
    </div>
  );
}
