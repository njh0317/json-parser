import { Wand2, Minimize2, Copy, Download, Trash2 } from 'lucide-react';
import { IndentOption } from '../types';

interface ToolbarProps {
  onFormat: () => void;
  onMinify: () => void;
  onCopy: () => void;
  onDownload: () => void;
  onClear: () => void;
  indentOption: IndentOption;
  onIndentChange: (option: IndentOption) => void;
  isValidJSON: boolean;
}

export function Toolbar({
  onFormat,
  onMinify,
  onCopy,
  onDownload,
  onClear,
  indentOption,
  onIndentChange,
  isValidJSON,
}: ToolbarProps) {
  const buttonClass = `flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors
    ${isValidJSON 
      ? 'bg-blue-500 hover:bg-blue-600 text-white' 
      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`;

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
      <button onClick={onFormat} disabled={!isValidJSON} className={buttonClass} title="Format">
        <Wand2 size={16} /> Format
      </button>
      <button onClick={onMinify} disabled={!isValidJSON} className={buttonClass} title="Minify">
        <Minimize2 size={16} /> Minify
      </button>
      <button onClick={onCopy} disabled={!isValidJSON} className={buttonClass} title="Copy">
        <Copy size={16} /> Copy
      </button>
      <button onClick={onDownload} disabled={!isValidJSON} className={buttonClass} title="Download">
        <Download size={16} /> Download
      </button>
      <button
        onClick={onClear}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white"
        title="Clear"
      >
        <Trash2 size={16} /> Clear
      </button>
      
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">Indent:</span>
        <select
          value={indentOption}
          onChange={(e) => {
            const val = e.target.value;
            onIndentChange(val === 'tab' ? 'tab' : (parseInt(val) as IndentOption));
          }}
          className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
        >
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
          <option value="tab">Tab</option>
        </select>
      </div>
    </div>
  );
}
