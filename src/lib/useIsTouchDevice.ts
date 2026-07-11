"use client";

import { useEffect, useState } from "react";

/** True on touch/coarse-pointer devices (phones, tablets) — used to keep the
 * map from hijacking single-finger page scroll gestures on mobile. */
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setIsTouch(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isTouch;
}
