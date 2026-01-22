import { useState } from 'react';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { InputPanel } from './components/InputPanel';
import { OutputPanel } from './components/OutputPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { useTheme } from './hooks/useTheme';
import { useJsonParser } from './hooks/useJsonParser';
import { downloadJSON } from './services/fileHandler';
import { HistoryItem } from './types';

function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    input,
    setInput,
    output,
    parseResult,
    indentOption,
    setIndentOption,
    viewMode,
    setViewMode,
    handleFormat,
    handleMinify,
    handleClear,
    handleCopy,
  } = useJsonParser();

  const [historyOpen, setHistoryOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const onCopy = async () => {
    const success = await handleCopy();
    if (success) showToast('Copied!');
  };

  const onDownload = () => {
    if (output) {
      downloadJSON(output);
      showToast('Downloaded!');
    }
  };

  const onHistorySelect = (item: HistoryItem) => {
    setInput(item.content);
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header theme={theme} onThemeToggle={toggleTheme} onHistoryOpen={() => setHistoryOpen(true)} />
      <Toolbar
        onFormat={handleFormat}
        onMinify={handleMinify}
        onCopy={onCopy}
        onDownload={onDownload}
        onClear={handleClear}
        indentOption={indentOption}
        onIndentChange={setIndentOption}
        isValidJSON={parseResult.success && !!input.trim()}
      />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="h-1/2 md:h-full md:flex-1 min-h-0 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
          <InputPanel value={input} onChange={setInput} parseResult={parseResult} theme={theme} />
        </div>
        <div className="h-1/2 md:h-full md:flex-1 min-h-0">
          <OutputPanel
            value={output}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            theme={theme}
            parseResult={parseResult}
          />
        </div>
      </div>
      <HistoryPanel isOpen={historyOpen} onClose={() => setHistoryOpen(false)} onSelect={onHistorySelect} />
      {toast && (
        <div className="fixed bottom-4 right-4 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
