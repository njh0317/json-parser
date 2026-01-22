import { useEffect, useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { HistoryItem } from '../types';
import { getAll, remove } from '../services/historyManager';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: HistoryItem) => void;
}

export function HistoryPanel({ isOpen, onClose, onSelect }: HistoryPanelProps) {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      getAll().then(setItems).catch(console.error);
    }
  }, [isOpen]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await remove(id);
    setItems(items.filter((item) => item.id !== id));
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative ml-auto w-80 h-full bg-white dark:bg-gray-800 shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <span className="font-medium text-gray-800 dark:text-white">History</span>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {items.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">No history</div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => { onSelect(item); onClose(); }}
                className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {formatTime(item.timestamp)}
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 truncate font-mono">
                      {item.preview}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="ml-2 p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
