import { Save, Eye, Loader2 } from 'lucide-react';

interface SettingsHeaderProps {
  onSave?: () => void;
  onPreview?: () => void;
  isSaving?: boolean;
}

export default function SettingsHeader({ onSave, onPreview, isSaving = false }: SettingsHeaderProps) {
  return (
    <div className="flex flex-row gap-2 md:gap-0 items-center justify-between mb-8">
      <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
        Timer Settings
      </h1>
      <div className="flex gap-3">
        <button 
          className="btn btn--secondary" 
          type="button"
          onClick={onPreview}
          disabled={isSaving}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
        >
          <Eye size={16} />
          <span className='text-sm hidden md:block'>Preview</span>
        </button>
        <button 
          className="btn cursor-pointer flex items-center gap-2" 
          type="button"
          onClick={onSave}
          disabled={isSaving}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-2)',
            opacity: isSaving ? 0.7 : 1,
            cursor: isSaving ? 'not-allowed' : 'pointer'
          }}
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span className='text-sm hidden md:block'>Saving...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span className='text-sm hidden md:block'>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

