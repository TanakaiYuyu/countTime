/**
 * Colon Component
 * 
 * Renders a colon separator (:) between time units.
 * Uses two small circular divs with LED-style glow effect.
 */

interface ColonProps {
  /** Color for the colon dots */
  color?: string;
  /** Height of the display (used to size the colon proportionally) */
  height?: number;
}

export default function Colon({
  color = '#00ff9c',
  height = 250,
}: ColonProps) {
  // Responsive sizing based on display height with clamp for fluid scaling
  const heightRem = height / 16;
  const dotSizeRem = heightRem * 0.08;
  const gapRem = heightRem * 0.1;
  const totalHeightRem = dotSizeRem * 2 + gapRem;
  
  // Use clamp for responsive dot sizes
  const dotSize = `clamp(0.5rem, ${dotSizeRem}rem, 1.5rem)`;
  const gap = `clamp(0.25rem, ${gapRem}rem, 1rem)`;

  return (
    <div
      className="relative inline-flex flex-col justify-center items-center"
      style={{
        width: dotSize,
        height: `${totalHeightRem}rem`,
        margin: '0 clamp(0.25rem, 1vw, 1rem)',
      }}
    >
      {/* Top dot */}
      <div
        className="rounded-full transition-colors duration-300"
        style={{
          width: dotSize,
          height: dotSize,
          backgroundColor: color,
          boxShadow: `0 0 clamp(0.25rem, 0.5vw, 0.5rem) ${color}80`,
        }}
      />
      
      {/* Bottom dot */}
      <div
        className="rounded-full transition-colors duration-300"
        style={{
          width: dotSize,
          height: dotSize,
          backgroundColor: color,
          marginTop: gap,
          boxShadow: `0 0 clamp(0.25rem, 0.5vw, 0.5rem) ${color}80`,
        }}
      />
    </div>
  );
}
