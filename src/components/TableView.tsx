import { Theme } from '../types';

interface TableViewProps {
  data: unknown;
  theme: Theme;
}

export function TableView({ data }: TableViewProps) {
  if (!Array.isArray(data)) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Table view is only available for arrays
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Empty array
      </div>
    );
  }

  // 모든 객체의 키를 수집
  const allKeys = new Set<string>();
  data.forEach((item) => {
    if (item && typeof item === 'object' && !Array.isArray(item)) {
      Object.keys(item as Record<string, unknown>).forEach((key) => allKeys.add(key));
    }
  });

  const columns = Array.from(allKeys);

  if (columns.length === 0) {
    // 단순 배열 (객체가 아닌 경우)
    return (
      <div className="p-4 overflow-auto h-full">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">Index</th>
              <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">{index}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                  {JSON.stringify(item)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-auto h-full">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            {columns.map((col) => (
              <th key={col} className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              {columns.map((col) => {
                const val = (item as Record<string, unknown>)?.[col];
                return (
                  <td key={col} className="border border-gray-300 dark:border-gray-600 px-3 py-2">
                    {val === undefined ? '' : typeof val === 'object' ? JSON.stringify(val) : String(val)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
