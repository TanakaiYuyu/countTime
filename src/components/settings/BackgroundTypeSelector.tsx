import {
  SettingsLabel,
  SettingsRadioFrame,
  SettingsRadioLabel,
} from '@telemetryos/sdk/react';

interface BackgroundTypeSelectorProps {
  backgroundType: 'default' | 'solid' | 'media';
  onBackgroundTypeChange: (value: 'default' | 'solid' | 'media') => void;
}

export default function BackgroundTypeSelector({ backgroundType, onBackgroundTypeChange }: BackgroundTypeSelectorProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <SettingsLabel>Background</SettingsLabel>
      <SettingsRadioFrame>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {[
            { value: 'default', label: 'Default Theme Background' },
            { value: 'solid', label: 'Solid Color' },
            { value: 'media', label: 'Image / Video' },
          ].map((bg) => (
            <label
              key={bg.value}
              style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', cursor: 'pointer' }}
            >
              <input
                type="radio"
                name="backgroundType"
                value={bg.value}
                checked={backgroundType === bg.value}
                onChange={(e) => onBackgroundTypeChange(e.target.value as 'default' | 'solid' | 'media')}
              />
              <SettingsRadioLabel>{bg.label}</SettingsRadioLabel>
            </label>
          ))}
        </div>
      </SettingsRadioFrame>
    </div>
  );
}

