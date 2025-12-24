import { useState, useRef, useEffect } from 'react';

interface TimePickerProps {
  value: string; // HH:MM format
  onChange: (value: string) => void;
  className?: string;
}

export default function TimePicker({ value, onChange, className = '' }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse value or use current time
  const [hours, minutes] = value ? value.split(':').map(Number) : [new Date().getHours(), new Date().getMinutes()];
  const [selectedHours, setSelectedHours] = useState(hours);
  const [selectedMinutes, setSelectedMinutes] = useState(minutes);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Update selected time when value changes
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':').map(Number);
      // Use setTimeout to avoid calling setState synchronously in effect
      setTimeout(() => {
        setSelectedHours(h);
        setSelectedMinutes(m);
      }, 0);
    }
  }, [value]);

  const formatTime = (h: number, m: number): string => {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const formatDisplayTime = (h: number, m: number): string => {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHours = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHours}:${String(m).padStart(2, '0')} ${period}`;
  };

  const handleTimeSelect = (h: number, m: number) => {
    setSelectedHours(h);
    setSelectedMinutes(m);
    onChange(formatTime(h, m));
    setIsOpen(false);
  };

  const handleNow = () => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    handleTimeSelect(h, m);
  };

  // Generate hour options (0-23)
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  
  // Generate minute options (0-59, in 5-minute increments for better UX)
  const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <div
      ref={containerRef}
      className={`time-picker-container ${className}`}
      style={{ position: 'relative' }}
    >
      <input
        type="text"
        readOnly
        value={value ? formatDisplayTime(selectedHours, selectedMinutes) : ''}
        onClick={() => setIsOpen(true)}
        placeholder="Select a time"
        className="input input--time h-full"
        style={{ cursor: 'pointer' }}
      />
      
      {isOpen && (
        <div
          className="time-picker-popup"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 1000,
            backgroundColor: 'var(--color-surface)',
            border: 'var(--border-width) solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            padding: 'var(--space-4)',
            minWidth: '16rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-4)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Hours selector */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-muted)',
                  marginBottom: 'var(--space-2)',
                  textAlign: 'center',
                }}
              >
                Hour
              </div>
              <div
                style={{
                  maxHeight: '12rem',
                  overflowY: 'auto',
                  border: 'var(--border-width) solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface-raised)',
                }}
              >
                {hourOptions.map((h) => {
                  const isSelected = h === selectedHours;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleTimeSelect(h, selectedMinutes)}
                      style={{
                        width: '100%',
                        padding: 'var(--space-2) var(--space-3)',
                        border: 'none',
                        backgroundColor: isSelected ? 'var(--color-accent)' : 'transparent',
                        color: isSelected ? '#FFFFFF' : 'var(--color-text)',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: isSelected ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-base)',
                        textAlign: 'center',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {String(h).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text)',
                padding: '0 var(--space-2)',
              }}
            >
              :
            </div>

            {/* Minutes selector */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-muted)',
                  marginBottom: 'var(--space-2)',
                  textAlign: 'center',
                }}
              >
                Minute
              </div>
              <div
                style={{
                  maxHeight: '12rem',
                  overflowY: 'auto',
                  border: 'var(--border-width) solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface-raised)',
                }}
              >
                {minuteOptions.map((m) => {
                  const isSelected = m === selectedMinutes;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleTimeSelect(selectedHours, m)}
                      style={{
                        width: '100%',
                        padding: 'var(--space-2) var(--space-3)',
                        border: 'none',
                        backgroundColor: isSelected ? 'var(--color-accent)' : 'transparent',
                        color: isSelected ? '#FFFFFF' : 'var(--color-text)',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: isSelected ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-base)',
                        textAlign: 'center',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {String(m).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Now button */}
          <div
            style={{
              marginTop: 'var(--space-4)',
              paddingTop: 'var(--space-4)',
              borderTop: 'var(--border-width) solid var(--color-border)',
            }}
          >
            <button
              type="button"
              onClick={handleNow}
              className="btn btn--secondary"
              style={{
                width: '100%',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

