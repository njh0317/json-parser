import { Sun, Moon, History } from 'lucide-react';
import { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
  onThemeToggle: () => void;
  onHistoryOpen: () => void;
}

export function Header({ theme, onThemeToggle, onHistoryOpen }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-gray-800 dark:text-white">
          JSON Parser
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onHistoryOpen}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          title="History"
        >
          <History size={20} />
        </button>
        <button
          onClick={onThemeToggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
