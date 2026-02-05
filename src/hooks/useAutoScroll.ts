import { useRef, useState, useCallback, useEffect } from 'react';

const DEFAULT_THRESHOLD = 50;

interface UseAutoScrollOptions {
  /** Threshold in pixels for "at bottom" detection (default: 50) */
  threshold?: number;
  /** Behavior for scroll animation (default: 'smooth') */
  scrollBehavior?: ScrollBehavior;
}

interface UseAutoScrollReturn {
  /** Whether user is at the scroll bottom (live mode) */
  isLive: boolean;
  /** Function to scroll to bottom */
  scrollToBottom: () => void;
  /** Ref to attach to scrollable container */
  containerRef: React.RefObject<HTMLDivElement>;
}

/**
 * Hook for auto-scroll behavior with scroll state detection.
 * Implements FR-003 (auto-scroll), FR-004 (pause on manual scroll), FR-006 (resume).
 * 
 * @param options - Configuration options
 * @returns Auto-scroll state and controls
 */
export function useAutoScroll(options?: UseAutoScrollOptions): UseAutoScrollReturn {
  const { threshold = DEFAULT_THRESHOLD, scrollBehavior = 'smooth' } = options ?? {};
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLive, setIsLive] = useState(true);
  const pendingScrollRef = useRef<number | null>(null);

  const scrollToBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    // Cancel any pending scroll animation
    if (pendingScrollRef.current !== null) {
      cancelAnimationFrame(pendingScrollRef.current);
    }

    // Use requestAnimationFrame for smooth batched scrolling (R4: rapid updates)
    pendingScrollRef.current = requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: scrollBehavior,
      });
      setIsLive(true);
      pendingScrollRef.current = null;
    });
  }, [scrollBehavior]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const atBottom = distanceFromBottom < threshold;
      setIsLive(atBottom);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (pendingScrollRef.current !== null) {
        cancelAnimationFrame(pendingScrollRef.current);
      }
    };
  }, [threshold]);

  return { containerRef, isLive, scrollToBottom };
}
