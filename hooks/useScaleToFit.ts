"use client";

import { useLayoutEffect, useRef, useState } from "react";

export function useScaleToFit<T extends HTMLElement>(contentWidth: number, padding = 0, maxScale = 1) {
  const ref = useRef<T>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => {
      const available = element.clientWidth - padding;
      if (available <= 0) return;
      setScale(Math.min(maxScale, available / contentWidth));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [contentWidth, padding, maxScale]);

  return { ref, scale };
}

export function useElementHeight<T extends HTMLElement>(initial: number) {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState(initial);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => setHeight(element.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, height };
}
