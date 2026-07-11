export default function AndrewMascot({
  size = 32,
  animated = false,
  className,
}: {
  size?: number;
  animated?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size * (250 / 220)}
      viewBox="0 0 220 250"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animated ? "andrew-float-wrap" : ""} ${className ?? ""}`}
      aria-label="Andrew avatar"
    >
      <g className={animated ? "andrew-ear-l" : undefined}>
        <polygon points="38,112 65,38 96,115" fill="#282828" />
        <polygon points="52,106 66,56 83,109" fill="#f87171" opacity="0.88" />
      </g>
      <g className={animated ? "andrew-ear-r" : undefined}>
        <polygon points="124,115 155,38 182,112" fill="#282828" />
        <polygon points="137,109 154,56 168,106" fill="#f87171" opacity="0.88" />
      </g>
      <ellipse cx="110" cy="155" rx="86" ry="82" fill="#424242" />
      <rect x="42" y="130" width="62" height="36" rx="10" fill="#0c0005" />
      <rect x="42" y="130" width="62" height="36" rx="10" fill="none" stroke="#ef4444" strokeWidth="2.5" />
      <ellipse
        cx="55"
        cy="140"
        rx="13"
        ry="8"
        fill="white"
        opacity="0.18"
        transform="rotate(-18,55,140)"
        className={animated ? "andrew-lens-shine" : undefined}
      />
      <rect x="116" y="130" width="62" height="36" rx="10" fill="#0c0005" />
      <rect x="116" y="130" width="62" height="36" rx="10" fill="none" stroke="#ef4444" strokeWidth="2.5" />
      <ellipse
        cx="129"
        cy="140"
        rx="13"
        ry="8"
        fill="white"
        opacity="0.18"
        transform="rotate(-18,129,140)"
        className={animated ? "andrew-lens-shine" : undefined}
      />
      <line x1="104" y1="149" x2="116" y2="149" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="42" y1="147" x2="26" y2="143" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="178" y1="147" x2="194" y2="143" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M104,178 L110,185 L116,178 Q110,173 104,178Z" fill="#f87171" />
      <path d="M100,188 Q110,198 122,190" fill="none" stroke="#7a5560" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="172" x2="100" y2="179" stroke="#7a7a7a" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="15" y1="182" x2="100" y2="183" stroke="#7a7a7a" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="20" y1="192" x2="100" y2="187" stroke="#7a7a7a" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="202" y1="172" x2="120" y2="179" stroke="#7a7a7a" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="205" y1="182" x2="120" y2="183" stroke="#7a7a7a" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="200" y1="192" x2="120" y2="187" stroke="#7a7a7a" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M35,220 Q110,242 185,220" fill="none" stroke="#dc2626" strokeWidth="9" strokeLinecap="round" />
      <circle cx="110" cy="233" r="10" fill="#ef4444" />
      <text x="110" y="237" textAnchor="middle" fill="white" fontSize="9" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
        N
      </text>
    </svg>
  );
}
