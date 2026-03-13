import { useState, useCallback } from 'react';
import { generateTags, generateSummary } from '../utils/ai';

interface UseAIReturn {
  loading: boolean;
  error: string | null;
  getTags: (content: string) => Promise<string[]>;
  getSummary: (content: string) => Promise<string>;
}

export function useAI(): UseAIReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTags = useCallback(async (content: string): Promise<string[]> => {
    setLoading(true);
    setError(null);
    try {
      return await generateTags(content);
    } catch (err) {
      const message = err instanceof Error ? err.message : '태그 생성 실패';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getSummary = useCallback(async (content: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      return await generateSummary(content);
    } catch (err) {
      const message = err instanceof Error ? err.message : '요약 생성 실패';
      setError(message);
      return '';
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, getTags, getSummary };
}
