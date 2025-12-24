import { useEffect, useMemo, useState } from 'react';
import { media } from '@telemetryos/sdk';
import {
  SettingsButtonFrame,
  SettingsError,
  SettingsField,
  SettingsHint,
  SettingsLabel,
  SettingsSelectFrame,
} from '@telemetryos/sdk/react';

type MediaOption = {
  id: string;
  name: string;
  contentType?: string;
  thumbnailUrl?: string;
};

type TelemetryMediaPickerProps = {
  label: string;
  value: string | null;
  onChange: (id: string | null) => void;
  allowedTypes?: Array<'image' | 'video'>;
  hint?: string;
  placeholder?: string;
};

const FALLBACK_MEDIA: MediaOption[] = [
  { id: 'sample-image-1', name: 'Sample Image 1', contentType: 'image/jpeg' },
  { id: 'sample-video-1', name: 'Sample Video 1', contentType: 'video/mp4' },
];

export default function TelemetryMediaPicker({
  label,
  value,
  onChange,
  allowedTypes = ['image', 'video'],
  hint,
  placeholder = 'No media selected',
}: TelemetryMediaPickerProps) {
  const [options, setOptions] = useState<MediaOption[]>([]);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredOptions = useMemo(() => {
    if (!allowedTypes.length) return options;
    return options.filter((item) =>
      allowedTypes.some((type) => (item.contentType || '').startsWith(type))
    );
  }, [allowedTypes, options]);

  const loadMedia = async (nextFolderId?: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const mediaApi = media();
      const folders = await mediaApi.getAllFolders();
      const selectedFolderId =
        nextFolderId ?? folderId ?? folders.find((f) => f.default)?.id ?? folders[0]?.id ?? null;

      setFolderId(selectedFolderId);

      if (!selectedFolderId) {
        setOptions(FALLBACK_MEDIA);
        throw new Error('No TelemetryOS media folders available.');
      }

      const mediaItems = await mediaApi.getAllByFolderId(selectedFolderId);
      setOptions(mediaItems);
    } catch (err) {
      console.warn('TelemetryOS media fetch failed, falling back to placeholders.', err);
      setOptions(FALLBACK_MEDIA);
      setError('Could not reach TelemetryOS media. Using placeholder media.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia().catch(() => {
      // handled in loadMedia
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SettingsField>
      <SettingsLabel>{label}</SettingsLabel>
      <SettingsSelectFrame>
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || null)}
          style={{
            width: '100%',
            minHeight: 'var(--height-input)',
            border: 'none',
            background: 'transparent',
            fontSize: 'var(--font-size-base)',
            color: 'var(--color-text)',
          }}
        >
          <option value="">{placeholder}</option>
          {filteredOptions.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} {item.contentType ? `(${item.contentType})` : ''}
            </option>
          ))}
        </select>
      </SettingsSelectFrame>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 'var(--space-3)',
          marginTop: 'var(--space-3)',
        }}
      >
        {filteredOptions.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            style={{
              border:
                value === item.id
                  ? '2px solid var(--color-accent)'
                  : '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-3)',
              textAlign: 'left',
              background: 'var(--color-surface)',
              display: 'flex',
              gap: 'var(--space-3)',
              cursor: 'pointer',
              transition: 'border-color var(--transition-base), box-shadow var(--transition-base)',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-surface-raised)',
                backgroundImage: item.thumbnailUrl ? `url(${item.thumbnailUrl})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                flexShrink: 0,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text)' }}>
                {item.name}
              </span>
              <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                {item.contentType || 'unknown type'}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: 'var(--space-3)',
          alignItems: 'center',
          marginTop: 'var(--space-3)',
          flexWrap: 'wrap',
        }}
      >
        <SettingsButtonFrame>
          <button
            type="button"
            onClick={() => loadMedia()}
            disabled={loading}
            style={{
              minWidth: '10rem',
              height: 'var(--height-button)',
              padding: '0 var(--space-4)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface-raised)',
              cursor: loading ? 'wait' : 'pointer',
            }}
          >
            {loading ? 'Refreshing…' : 'Refresh from TelemetryOS'}
          </button>
        </SettingsButtonFrame>

        {folderId && (
          <SettingsHint>
            Loading from TelemetryOS folder: <strong>{folderId}</strong>
          </SettingsHint>
        )}
      </div>

      {hint && <SettingsHint>{hint}</SettingsHint>}
      {error && <SettingsError>{error}</SettingsError>}
    </SettingsField>
  );
}


