import Editor from '@monaco-editor/react';
import { Theme, ViewMode, ParseResult } from '../types';
import { TreeView } from './TreeView';
import { TableView } from './TableView';

interface OutputPanelProps {
  value: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  theme: Theme;
  parseResult: ParseResult;
}

export function OutputPanel({ value, viewMode, onViewModeChange, theme, parseResult }: OutputPanelProps) {
  const tabs: { mode: ViewMode; label: string }[] = [
    { mode: 'editor', label: 'Editor' },
    { mode: 'tree', label: 'Tree' },
    { mode: 'table', label: 'Table' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-4">Output</span>
        <div className="flex gap-1">
          {tabs.map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`px-3 py-1 text-sm rounded ${
                viewMode === mode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {viewMode === 'editor' && (
          <Editor
            height="100%"
            defaultLanguage="json"
            value={value}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
            }}
          />
        )}
        {viewMode === 'tree' && parseResult.success && parseResult.data !== undefined && (
          <TreeView data={parseResult.data} theme={theme} />
        )}
        {viewMode === 'table' && parseResult.success && parseResult.data !== undefined && (
          <TableView data={parseResult.data} theme={theme} />
        )}
      </div>
    </div>
  );
}
