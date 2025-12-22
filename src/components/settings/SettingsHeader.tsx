import { Save, Eye } from 'lucide-react';

export default function SettingsHeader() {
  return (
    <div className="flex flex-row gap-2 md:gap-0 items-center justify-between mb-8">
      <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
        Timer Settings
      </h1>
      <div className="flex gap-3">
          <button className="btn btn--secondary" type="button">
            <Eye size={16} />
            <span className='text-sm hidden md:block'>Preview</span>
          </button>
          <button className="btn cursor-pointer flex items-center gap-2" type="button">
            <Save size={16} />
            <span className='text-sm hidden md:block'>Save Changes</span>
          </button>
        </div>
    </div>
  );
}

