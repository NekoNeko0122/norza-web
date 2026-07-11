"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useIsTouchDevice } from "@/lib/useIsTouchDevice";

/**
 * On touch devices, a single-finger drag on the map otherwise hijacks the
 * page's scroll gesture. Disabling Leaflet's drag-to-pan there lets touch
 * scrolling pass straight through to the page; pinch-to-zoom (two fingers)
 * and the zoom slider/buttons still work.
 */
export default function DisableDragOnTouch() {
  const map = useMap();
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    if (isTouch) {
      map.dragging.disable();
    } else {
      map.dragging.enable();
    }
  }, [isTouch, map]);

  return null;
}
