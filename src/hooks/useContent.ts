import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage demo/API content fetching and lifecycle states.
 * Demonstrates loading states, error handling, and retry support.
 */
export function useContent<T>(fetchFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryIndex, setRetryIndex] = useState(0);

  const refetch = useCallback(() => {
    setRetryIndex((current) => current + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setLoading(true);
        const result = await fetchFn();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch content'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [fetchFn, retryIndex]);

  return { data, loading, error, refetch };
}
