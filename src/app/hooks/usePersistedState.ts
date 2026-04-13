import { useState, useEffect, useCallback } from 'react';

interface UsePersistedStateOptions<T> {
  key: string;
  defaultValue: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
}

export function usePersistedState<T>({
  key,
  defaultValue,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
}: UsePersistedStateOptions<T>): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? deserialize(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, serialize(state));
    } catch (error) {
      console.error('Failed to persist state:', error);
    }
  }, [key, state, serialize]);

  const setPersistedState = useCallback((value: T | ((prev: T) => T)) => {
    setState(value);
  }, []);

  return [state, setPersistedState];
}
