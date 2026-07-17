import React, { useState, useEffect, useRef } from "react";

interface LazyListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  initialCount?: number;
  increment?: number;
  className?: string;
  placeholder?: React.ReactNode;
}

export default function LazyList<T>({
  items,
  renderItem,
  initialCount = 10,
  increment = 10,
  className = "",
  placeholder,
}: LazyListProps<T>) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Reset visible count when item list changes
    setVisibleCount(Math.min(initialCount, items.length));
  }, [items, initialCount]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && visibleCount < items.length) {
          setVisibleCount((prev) => Math.min(prev + increment, items.length));
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [items.length, visibleCount, increment]);

  return (
    <div className={className}>
      {items.slice(0, visibleCount).map((item, index) => renderItem(item, index))}

      {/* Sentinel element to trigger loading of more items */}
      {visibleCount < items.length && (
        <div ref={observerRef} className="py-4 flex justify-center items-center">
          {placeholder || (
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
              <div className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
              <div className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
              <span className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider ml-2">Lazy buffering...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
