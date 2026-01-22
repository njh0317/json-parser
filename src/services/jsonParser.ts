import { ParseResult } from '../types';

/**
 * JSON 문자열을 파싱하고 유효성을 검증합니다.
 */
export function parse(input: string): ParseResult {
  if (!input.trim()) {
    return { success: false, error: { message: 'Empty input', line: 1, column: 1 } };
  }

  try {
    const data = JSON.parse(input);
    return { success: true, data };
  } catch (e) {
    const error = e as SyntaxError;
    const { line, column } = extractErrorPosition(error.message, input);
    return {
      success: false,
      error: {
        message: error.message,
        line,
        column,
      },
    };
  }
}

/**
 * JSON 문자열의 유효성을 검증합니다.
 */
export function validate(input: string): boolean {
  return parse(input).success;
}

/**
 * 에러 메시지에서 위치 정보를 추출합니다.
 */
function extractErrorPosition(message: string, input: string): { line: number; column: number } {
  // JSON.parse 에러 메시지에서 position 추출 시도
  // 예: "Unexpected token } in JSON at position 42"
  const positionMatch = message.match(/position\s+(\d+)/i);
  
  if (positionMatch) {
    const position = parseInt(positionMatch[1], 10);
    return positionToLineColumn(input, position);
  }

  // 위치 정보가 없으면 기본값 반환
  return { line: 1, column: 1 };
}

/**
 * 문자열 위치를 줄/열로 변환합니다.
 */
function positionToLineColumn(input: string, position: number): { line: number; column: number } {
  const lines = input.substring(0, position).split('\n');
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;
  return { line, column };
}
