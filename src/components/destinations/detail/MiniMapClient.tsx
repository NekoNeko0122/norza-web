"use client";

import dynamic from "next/dynamic";

const MiniMap = dynamic(() => import("./MiniMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-tint text-xs text-brand-500">
      Loading map…
    </div>
  ),
});

export default MiniMap;
