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
  // Size colon proportionally to display height
  // Convert pixel height to rem (1rem = 16px)
  const heightRem = height / 16;
  const dotSizeRem = heightRem * 0.08;
  const gapRem = heightRem * 0.1;
  const totalHeightRem = dotSizeRem * 2 + gapRem;

  return (
    <div
      className="relative inline-flex flex-col justify-center items-center mx-2"
      style={{
        width: `${dotSizeRem}rem`,
        height: `${totalHeightRem}rem`,
      }}
    >
      {/* Top dot */}
      <div
        className="rounded-full transition-colors duration-300"
        style={{
          width: `${dotSizeRem}rem`,
          height: `${dotSizeRem}rem`,
          backgroundColor: color,
        }}
      />
      
      {/* Bottom dot */}
      <div
        className="rounded-full transition-colors duration-300"
        style={{
          width: `${dotSizeRem}rem`,
          height: `${dotSizeRem}rem`,
          backgroundColor: color,
          marginTop: `${gapRem}rem`,
        }}
      />
    </div>
  );
}
