import {
  SettingsBox,
  SettingsField,
  SettingsHeading,
  SettingsLabel,
} from '@telemetryos/sdk/react';
import { useCountdownStoreContext } from '../../hooks/useCountdownStore';
import ColorPickerField from './ColorPickerField';
import BackgroundTypeSelector from './BackgroundTypeSelector';
import BackgroundOpacitySlider from './BackgroundOpacitySlider';
import TelemetryMediaPicker from './TelemetryMediaPicker';

export default function ThemeBackgroundCard() {
  const {
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    backgroundType,
    setBackgroundType,
    backgroundColor,
    setBackgroundColor,
    backgroundMediaId,
    setBackgroundMediaId,
    backgroundOpacity,
    setBackgroundOpacity,
  } = useCountdownStoreContext();

  return (
    <SettingsBox>
      <SettingsHeading>Theme & Background</SettingsHeading>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
        <ColorPickerField label="Primary Color" value={primaryColor} onChange={setPrimaryColor} />
        <ColorPickerField label="Secondary Color" value={secondaryColor} onChange={setSecondaryColor} />
      </div>

      <SettingsField>
        <BackgroundTypeSelector backgroundType={backgroundType} onBackgroundTypeChange={setBackgroundType} />
      </SettingsField>

      {backgroundType === 'solid' && (
        <SettingsField>
          <ColorPickerField label="Background Color" value={backgroundColor} onChange={setBackgroundColor} />
        </SettingsField>
      )}

      {backgroundType === 'media' && (
        <SettingsField>
          <SettingsLabel>Background Media</SettingsLabel>
          <TelemetryMediaPicker
            label="Select Background"
            value={backgroundMediaId}
            onChange={setBackgroundMediaId}
            allowedTypes={['image', 'video']}
            hint="Pulled from TelemetryOS media. Preview only; final render happens on /render."
          />
        </SettingsField>
      )}

      <SettingsField>
        <BackgroundOpacitySlider value={backgroundOpacity} onChange={setBackgroundOpacity} />
      </SettingsField>
    </SettingsBox>
  );
}

