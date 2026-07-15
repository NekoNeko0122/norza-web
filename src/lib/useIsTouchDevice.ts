"use client";

import { useEffect, useState } from "react";

function getIsTouch() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

/** true on touch/coarse-pointer devices, so the map doesn't hijack page scroll on mobile */
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(getIsTouch);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const onChange = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isTouch;
}
