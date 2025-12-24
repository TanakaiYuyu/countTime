import {
  SettingsBox,
  SettingsCheckboxFrame,
  SettingsCheckboxLabel,
  SettingsField,
  SettingsHeading,
  SettingsInputFrame,
  SettingsLabel,
} from '@telemetryos/sdk/react';
import { useCountdownStore } from '../../hooks/useCountdownStore';

type UnitKey = 'days' | 'hours' | 'minutes' | 'seconds';

export default function TimeUnitsCard() {
  const { visibleUnits, setVisibleUnits, unitLabels, setUnitLabels } = useCountdownStore();

  const units: { key: UnitKey; label: string }[] = [
    { key: 'days', label: 'Days' },
    { key: 'hours', label: 'Hours' },
    { key: 'minutes', label: 'Minutes' },
    { key: 'seconds', label: 'Seconds' },
  ];

  const handleUnitToggle = (key: UnitKey) => {
    setVisibleUnits({
      ...visibleUnits,
      [key]: !visibleUnits[key],
    });
  };

  const handleLabelChange = (key: UnitKey, value: string) => {
    setUnitLabels({
      ...unitLabels,
      [key]: value,
    });
  };

  return (
    <SettingsBox>
      <SettingsHeading>Time Units</SettingsHeading>
      <SettingsField>
        <SettingsLabel>Visible Units</SettingsLabel>
        <SettingsCheckboxFrame>
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
            {units.map((unit) => (
              <label
                key={unit.key}
                className="flex items-center gap-2 rounded-sm px-2 py-1 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={visibleUnits[unit.key]}
                  onChange={() => handleUnitToggle(unit.key)}
                  className="h-4 w-4 cursor-pointer"
                />
                <SettingsCheckboxLabel>{unit.label}</SettingsCheckboxLabel>
              </label>
            ))}
          </div>
        </SettingsCheckboxFrame>
      </SettingsField>

      <div className="grid gap-3 grid-cols-2">
        {units.map((unit) => (
          <SettingsField key={unit.key}>
            <SettingsLabel>{unit.label} Label</SettingsLabel>
            <SettingsInputFrame>
              <input
                type="text"
                value={unitLabels[unit.key]}
                onChange={(e) => handleLabelChange(unit.key, e.target.value)}
                placeholder={`e.g., ${unit.label.toUpperCase()}`}
                style={{
                  border: 'var(--border-width) solid var(--color-border)',
                  borderRadius: 'var(--radius-md)'
                }}
                className="bg-transparent border px-3 py-3 text-base focus:outline-none"
              />
            </SettingsInputFrame>
          </SettingsField>
        ))}
      </div>
    </SettingsBox>
  );
}

