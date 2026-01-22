import { useState, useCallback, useEffect } from 'react';
import { ParseResult, IndentOption, ViewMode } from '../types';
import { parse } from '../services/jsonParser';
import { format, minify } from '../services/jsonFormatter';
import { save as saveHistory } from '../services/historyManager';

export function useJsonParser() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [parseResult, setParseResult] = useState<ParseResult>({ success: true });
  const [indentOption, setIndentOption] = useState<IndentOption>(2);
  const [viewMode, setViewMode] = useState<ViewMode>('editor');

  // 실시간 유효성 검증
  useEffect(() => {
    if (!input.trim()) {
      setParseResult({ success: true });
      setOutput('');
      return;
    }
    const result = parse(input);
    setParseResult(result);
    if (result.success && result.data !== undefined) {
      setOutput(format(result.data, indentOption));
    }
  }, [input, indentOption]);

  const handleFormat = useCallback(() => {
    const result = parse(input);
    if (result.success && result.data !== undefined) {
      const formatted = format(result.data, indentOption);
      setOutput(formatted);
      saveHistory(formatted).catch(console.error);
    }
  }, [input, indentOption]);

  const handleMinify = useCallback(() => {
    const result = parse(input);
    if (result.success && result.data !== undefined) {
      const minified = minify(result.data);
      setOutput(minified);
    }
  }, [input]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setParseResult({ success: true });
  }, []);

  const handleCopy = useCallback(async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      return true;
    }
    return false;
  }, [output]);

  return {
    input,
    setInput,
    output,
    setOutput,
    parseResult,
    indentOption,
    setIndentOption,
    viewMode,
    setViewMode,
    handleFormat,
    handleMinify,
    handleClear,
    handleCopy,
  };
}
