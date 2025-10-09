import { useState, useEffect } from 'react';

export const useDebouncedFilter = <T extends object>(
  initialFilters: T,
  delay = 500
) => {
  const [filters, setFilters] = useState<T>(initialFilters);
  const [debouncedFilters, setDebouncedFilters] = useState<T>(initialFilters);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    setIsDebouncing(true);
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [filters, delay]);

  const updateFilter = <K extends keyof T>(key: K, value: T[K]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
  };

  return {
    filters,
    debouncedFilters,
    isDebouncing,
    updateFilter,
    setFilters
  };
};
