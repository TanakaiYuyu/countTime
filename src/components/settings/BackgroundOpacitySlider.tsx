import { SettingsLabel, SettingsSliderFrame } from '@telemetryos/sdk/react';

interface BackgroundOpacitySliderProps {
  value: number; // 0-1
  onChange: (value: number) => void;
}

export default function BackgroundOpacitySlider({
  value,
  onChange,
}: BackgroundOpacitySliderProps) {
  const percentage = Math.round(value * 100);

  return (
    <div className="flex flex-col gap-2 w-full">
      <SettingsLabel>Background Opacity</SettingsLabel>
      <SettingsSliderFrame>
        <div className="flex items-center gap-3 w-full">
          <input
            type="range"
            min="0"
            max="100"
            value={percentage}
            onChange={(e) => onChange(Number(e.target.value) / 100)}
            className="w-full cursor-pointer"
            style={{ accentColor: 'var(--color-accent)' }}
          />
          <span className="text-right">
            {percentage}%
          </span>
        </div>
      </SettingsSliderFrame>
    </div>
  );
}

