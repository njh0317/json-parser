import { useCallback, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Upload, CheckCircle, XCircle } from 'lucide-react';
import { ParseResult, Theme } from '../types';
import { readFile } from '../services/fileHandler';

interface InputPanelProps {
  value: string;
  onChange: (value: string) => void;
  parseResult: ParseResult;
  theme: Theme;
}

export function InputPanel({ value, onChange, parseResult, theme }: InputPanelProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      try {
        const content = await readFile(file);
        onChange(content);
      } catch (err) {
        console.error(err);
      }
    }
  }, [onChange]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const content = await readFile(file);
        onChange(content);
      } catch (err) {
        console.error(err);
      }
    }
  }, [onChange]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Input</span>
        <div className="flex items-center gap-2">
          {value.trim() && (
            parseResult.success ? (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                <CheckCircle size={16} /> Valid
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
                <XCircle size={16} /> Invalid
              </span>
            )
          )}
          <label className="flex items-center gap-1 px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer text-sm">
            <Upload size={14} /> Upload
            <input type="file" accept=".json,.xml,.csv,.txt,.md" onChange={handleFileSelect} className="hidden" />
          </label>
        </div>
      </div>
      <div
        className={`flex-1 relative ${isDragging ? 'ring-2 ring-blue-500' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center z-10">
            <span className="text-blue-600 dark:text-blue-400 font-medium">Drop file here</span>
          </div>
        )}
        <Editor
          height="100%"
          defaultLanguage="json"
          value={value}
          onChange={(v) => onChange(v || '')}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
          }}
        />
      </div>
      {parseResult.error && (
        <div className="px-3 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
          Line {parseResult.error.line}: {parseResult.error.message}
        </div>
      )}
    </div>
  );
}
