export type AvatarGender = "female" | "male";

interface AvatarConfig {
  bg: [string, string];
  skin: string;
  hair: string;
  variant: "afro" | "braids" | "curly-bob" | "bun" | "fade";
}

const CONFIG: Record<string, AvatarConfig> = {
  "baby-jane-garcia": {
    bg: ["#ff8a65", "#ff5e57"],
    skin: "#3b2417",
    hair: "#160d08",
    variant: "afro",
  },
  "vonzell-mae-cabuguas": {
    bg: ["#3ddad7", "#0f9b8e"],
    skin: "#2a1810",
    hair: "#1a0f0a",
    variant: "braids",
  },
  "grace-anne-certeza": {
    bg: ["#ffd166", "#f2a30f"],
    skin: "#4a2e1c",
    hair: "#120a06",
    variant: "curly-bob",
  },
  "chrisdan-lyn-lirado": {
    bg: ["#c084fc", "#8b5cf6"],
    skin: "#1f130c",
    hair: "#0d0705",
    variant: "bun",
  },
  "sherwin-rodriguez": {
    bg: ["#5eb1ff", "#3f6fd6"],
    skin: "#55341f",
    hair: "#160d08",
    variant: "fade",
  },
};

const FALLBACK: AvatarConfig = {
  bg: ["#ff92c4", "#f0388c"],
  skin: "#2a1810",
  hair: "#160d08",
  variant: "afro",
};

function Face({ skin }: { skin: string }) {
  return (
    <>
      {/* shoulders / bust */}
      <path d="M 20 100 Q 20 74 50 74 Q 80 74 80 100 Z" fill={skin} opacity={0.9} />
      {/* neck */}
      <rect x="42" y="60" width="16" height="16" fill={skin} />
      {/* head */}
      <ellipse cx="50" cy="46" rx="24" ry="25" fill={skin} />
    </>
  );
}

function FacialFeatures({ smileDepth = 4 }: { smileDepth?: number }) {
  return (
    <>
      <ellipse cx="41" cy="46" rx="3.4" ry="4.2" fill="#1a0f0a" />
      <ellipse cx="59" cy="46" rx="3.4" ry="4.2" fill="#1a0f0a" />
      <path d="M 35 37 Q 41 34 47 36.5" stroke="#1a0f0a" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 53 36.5 Q 59 34 65 37" stroke="#1a0f0a" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path
        d={`M 42 58 Q 50 ${58 + smileDepth} 58 58`}
        stroke="#1a0f0a"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
    </>
  );
}

function Hair({ variant, hair }: { variant: AvatarConfig["variant"]; hair: string }) {
  switch (variant) {
    case "afro":
      return (
        <>
          <circle cx="50" cy="34" r="30" fill={hair} />
          <ellipse cx="50" cy="47" rx="25" ry="26" fill="var(--avatar-skin)" />
        </>
      );
    case "braids":
      return (
        <>
          <path d="M 25 46 Q 25 18 50 18 Q 75 18 75 46 L 75 32 Q 75 24 50 24 Q 25 24 25 32 Z" fill={hair} />
          <rect x="21" y="40" width="7" height="42" rx="3.5" fill={hair} />
          <rect x="72" y="40" width="7" height="42" rx="3.5" fill={hair} />
          <rect x="30" y="50" width="6" height="34" rx="3" fill={hair} />
          <rect x="64" y="50" width="6" height="34" rx="3" fill={hair} />
        </>
      );
    case "curly-bob":
      return (
        <>
          <path d="M 22 52 Q 20 16 50 16 Q 80 16 78 52 L 78 44 Q 80 60 68 62 L 68 40 Q 68 24 50 24 Q 32 24 32 40 L 32 62 Q 20 60 22 44 Z" fill={hair} />
          {[26, 34, 66, 74].map((cx) => (
            <circle key={cx} cx={cx} cy={54} r={6} fill={hair} />
          ))}
          <circle cx="50" cy="16" r="16" fill={hair} />
        </>
      );
    case "bun":
      return (
        <>
          <path d="M 25 44 Q 25 20 50 20 Q 75 20 75 44 L 75 34 Q 75 26 50 26 Q 25 26 25 34 Z" fill={hair} />
          <circle cx="50" cy="12" r="11" fill={hair} />
          <rect x="24" y="32" width="52" height="5" rx="2.5" fill="#f4c9a4" opacity={0.85} />
        </>
      );
    case "fade":
      return (
        <>
          <path d="M 26 34 Q 26 18 50 18 Q 74 18 74 34 Q 74 24 50 24 Q 26 24 26 34 Z" fill={hair} />
          <path d="M 40 63 Q 50 68 60 63 L 58 66 Q 50 70 42 66 Z" fill={hair} opacity={0.9} />
        </>
      );
  }
}

export default function CartoonAvatar({
  slug,
  size = 56,
  className,
  name,
}: {
  slug: string;
  size?: number;
  className?: string;
  name?: string;
}) {
  const cfg = CONFIG[slug] ?? FALLBACK;
  const gradId = `av-${slug}`;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={name ? `${name} avatar` : "avatar"}
      style={{ ["--avatar-skin" as string]: cfg.skin }}
    >
      <defs>
        <radialGradient id={gradId} cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor={cfg.bg[0]} />
          <stop offset="100%" stopColor={cfg.bg[1]} />
        </radialGradient>
        <clipPath id={`clip-${slug}`}>
          <rect width="100" height="100" rx="50" />
        </clipPath>
      </defs>
      <rect width="100" height="100" rx="50" fill={`url(#${gradId})`} />
      <g clipPath={`url(#clip-${slug})`}>
        <Face skin={cfg.skin} />
        <Hair variant={cfg.variant} hair={cfg.hair} />
        <FacialFeatures smileDepth={cfg.variant === "fade" ? 3 : 5} />
      </g>
    </svg>
  );
}
