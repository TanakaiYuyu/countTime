import { useCountdownStore } from '../../hooks/useCountdownStore';
import ColorPickerField from './ColorPickerField';
import BackgroundTypeSelector from './BackgroundTypeSelector';
import BackgroundOpacitySlider from './BackgroundOpacitySlider';

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
  } = useCountdownStore();

  return (
    <div className="section">
      <div className="card">
        <div className="card__header">
          <h2 className="card__title" style={{ fontSize: 'var(--font-size-lg)' }}>
            Theme & Background
          </h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <ColorPickerField
              label="Primary Color"
              value={primaryColor}
              onChange={setPrimaryColor}
            />
            <ColorPickerField
              label="Secondary Color"
              value={secondaryColor}
              onChange={setSecondaryColor}
            />
          </div>

          <BackgroundTypeSelector
            backgroundType={backgroundType}
            onBackgroundTypeChange={setBackgroundType}
          />

          {backgroundType === 'solid' && (
            <div style={{ marginTop: 'var(--space-4)' }}>
              <ColorPickerField
                label="Background Color"
                value={backgroundColor}
                onChange={setBackgroundColor}
              />
            </div>
          )}

          {backgroundType === 'media' && (
            <div className="field" style={{ marginTop: 'var(--space-4)' }}>
              <label className="field__label">Media Selection</label>
              <div
                className="border rounded-md p-8 text-center"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-surface-raised)',
                  borderStyle: 'dashed',
                }}
              >
                <p className="text-muted">Media picker placeholder</p>
                <button className="btn--small" type="button" style={{ marginTop: 'var(--space-3)' }}>
                  Select Media
                </button>
              </div>
            </div>
          )}

          <BackgroundOpacitySlider
            value={backgroundOpacity}
            onChange={setBackgroundOpacity}
          />
        </div>
      </div>
    </div>
  );
}

