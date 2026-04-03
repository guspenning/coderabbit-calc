/**
 * Official CodeRabbit logo component.
 * Renders the orange circle with white rabbit silhouette, optionally
 * followed by the "CodeRabbit" wordmark text.
 */

interface CodeRabbitLogoProps {
  /** Icon size in pixels (default 40) */
  size?: number;
  /** Color variant — 'dark' uses white text, 'light' uses black text */
  variant?: 'dark' | 'light';
  /** Whether to render the "CodeRabbit" wordmark alongside the icon */
  showWordmark?: boolean;
}

/**
 * Renders the CodeRabbit brand logo as an inline SVG icon with an
 * optional wordmark. Uses the official orange (#FF6B2C) brand color.
 *
 * @param props - Logo display options
 * @returns JSX element containing the logo SVG and optional wordmark
 */
export function CodeRabbitLogo({
  size = 40,
  variant = 'dark',
  showWordmark = true,
}: CodeRabbitLogoProps) {
  const textColor = variant === 'dark' ? '#FFFFFF' : '#1A1A1A';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="CodeRabbit logo"
      >
        <circle cx="50" cy="50" r="50" fill="#FF6B2C" />
        <g transform="translate(18, 12) scale(0.65)">
          <ellipse cx="35" cy="18" rx="8" ry="22" fill="white" transform="rotate(-10 35 18)" />
          <ellipse cx="55" cy="15" rx="7" ry="20" fill="white" transform="rotate(5 55 15)" />
          <ellipse cx="48" cy="45" rx="22" ry="20" fill="white" />
          <circle cx="56" cy="42" r="4" fill="#FF6B2C" />
          <circle cx="57" cy="41" r="1.5" fill="#1A1A1A" />
          <ellipse cx="38" cy="78" rx="28" ry="24" fill="white" />
          <ellipse cx="58" cy="98" rx="8" ry="14" fill="white" />
          <ellipse cx="18" cy="90" rx="14" ry="16" fill="white" transform="rotate(-15 18 90)" />
          <circle cx="8" cy="72" r="8" fill="white" />
          <ellipse cx="67" cy="47" rx="3" ry="2" fill="#FFB8A0" />
        </g>
      </svg>
      {showWordmark && (
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: `${Math.round(size * 0.55)}px`,
            fontWeight: 800,
            color: textColor,
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          CodeRabbit
        </span>
      )}
    </div>
  );
}
