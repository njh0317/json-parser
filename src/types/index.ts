// JSON 파싱 결과 타입
export interface ParseResult {
  success: boolean;
  data?: unknown;
  error?: {
    message: string;
    line: number;
    column: number;
  };
}

// 들여쓰기 옵션
export type IndentOption = 1 | 2 | 3 | 4 | 'tab';

// History Item
export interface HistoryItem {
  id: string;
  content: string;
  timestamp: number;
  preview: string;
}

// Theme
export type Theme = 'light' | 'dark';

// View Mode
export type ViewMode = 'editor' | 'tree' | 'table';

// Tree Node (for Tree View)
export interface TreeNode {
  key: string;
  value: unknown;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  children?: TreeNode[];
  expanded?: boolean;
}
