const SUPPORTED_EXTENSIONS = ['json', 'xml', 'csv', 'txt', 'md'];

/**
 * 파일 확장자가 지원되는지 확인합니다.
 */
export function isValidExtension(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return SUPPORTED_EXTENSIONS.includes(ext);
}

/**
 * 지원되는 파일 확장자 목록을 반환합니다.
 */
export function getSupportedExtensions(): string[] {
  return [...SUPPORTED_EXTENSIONS];
}

/**
 * 파일을 읽어서 문자열로 반환합니다.
 */
export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isValidExtension(file.name)) {
      reject(new Error(`Unsupported file type. Supported: ${SUPPORTED_EXTENSIONS.join(', ')}`));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * JSON 콘텐츠를 파일로 다운로드합니다.
 */
export function downloadJSON(content: string, filename?: string): void {
  const timestamp = generateTimestamp();
  const finalFilename = filename || `json-${timestamp}.json`;
  
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = finalFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 타임스탬프 문자열을 생성합니다.
 */
export function generateTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}
