import { useEffect, useRef, useState, useCallback } from 'react';

interface ResizeObserverSize {
  width: number;
  height: number;
}

interface UseResizeObserverReturn<T extends HTMLElement> {
  ref: React.RefObject<T>;
  width: number;
  height: number;
}

/**
 * Hook to observe element size changes using ResizeObserver.
 * Used to track audio status window height for transcript window sizing.
 */
export function useResizeObserver<T extends HTMLElement = HTMLDivElement>(): UseResizeObserverReturn<T> {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<ResizeObserverSize>({ width: 0, height: 0 });

  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    const entry = entries[0];
    if (entry) {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    }
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(handleResize);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [handleResize]);

  return { ref, ...size };
}

/**
 * Hook to observe an external element's size (passed via ref).
 * Used when observing a sibling component like AudioStatusIndicator.
 */
export function useExternalResizeObserver(
  externalRef: React.RefObject<HTMLElement> | undefined
): ResizeObserverSize {
  const [size, setSize] = useState<ResizeObserverSize>({ width: 0, height: 0 });

  useEffect(() => {
    const element = externalRef?.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [externalRef]);

  return size;
}
