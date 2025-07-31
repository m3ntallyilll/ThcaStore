interface SmokeIconProps {
  className?: string;
  color?: string;
}

export function SmokeIcon({ className = "w-6 h-6", color = "currentColor" }: SmokeIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Smoke waves */}
      <path
        d="M8 20c0-1.5 1-2.5 2.5-2.5S13 18.5 13 20s-1 2.5-2.5 2.5S8 21.5 8 20z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <path
        d="M10 16c0-1.2 0.8-2 2-2s2 0.8 2 2-0.8 2-2 2-2-0.8-2-2z"
        fill="currentColor"
        fillOpacity="0.4"
      />
      <path
        d="M11 12c0-1 0.7-1.5 1.5-1.5s1.5 0.5 1.5 1.5-0.7 1.5-1.5 1.5S11 13 11 12z"
        fill="currentColor"
        fillOpacity="0.5"
      />
      <path
        d="M12 8c0-0.8 0.5-1.2 1.2-1.2s1.2 0.4 1.2 1.2-0.5 1.2-1.2 1.2S12 8.8 12 8z"
        fill="currentColor"
        fillOpacity="0.6"
      />
      <path
        d="M13 4c0-0.6 0.4-1 1-1s1 0.4 1 1-0.4 1-1 1-1-0.4-1-1z"
        fill="currentColor"
        fillOpacity="0.7"
      />
      
      {/* Curly smoke trails */}
      <path
        d="M6 18c1-1 2-0.5 3-1.5s1-2 2-1 1 2 2 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M7 14c1.5-0.5 2.5 0 3.5-1s0.5-2 1.5-1.5 1.5 1.5 2.5 1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M9 10c1-0.5 1.5 0.5 2.5-0.5s0.5-1.5 1.5-1 1 1 2 0.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M11 6c0.8-0.3 1.2 0.2 2-0.3s0.3-1 1-0.8 0.8 0.8 1.5 0.3"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
    </svg>
  );
}