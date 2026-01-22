import { IndentOption } from '../types';

/**
 * JSON 데이터를 지정된 들여쓰기로 포맷팅합니다.
 */
export function format(data: unknown, indent: IndentOption = 2): string {
  const indentValue = indent === 'tab' ? '\t' : indent;
  return JSON.stringify(data, null, indentValue);
}

/**
 * JSON 데이터를 압축합니다 (모든 공백 제거).
 */
export function minify(data: unknown): string {
  return JSON.stringify(data);
}
