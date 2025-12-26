/**
 * Custom DateTimePicker Component
 * 
 * A fully custom date and time picker with styled dropdown UI.
 * Replaces native browser controls with TelemetryOS-styled components.
 */

import { useState, useRef, useEffect } from 'react';

interface DateTimePickerCustomProps {
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  hint?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function DateTimePickerCustom({
  value,
  onChange,
  label,
  placeholder = 'Select date and time',
  disabled = false,
  required = false,
  hint,
  className,
  style,
}: DateTimePickerCustomProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  // Format display value
  const formatDisplayValue = (date: Date | null): string => {
    if (!date) return '';
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    
    return date.toLocaleString(undefined, options);
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onChange(date.toISOString());
  };

  // Quick date options
  const quickOptions = [
    { label: 'In 1 hour', getValue: () => new Date(Date.now() + 60 * 60 * 1000) },
    { label: 'Tomorrow', getValue: () => new Date(Date.now() + 24 * 60 * 60 * 1000) },
    { label: 'In 1 week', getValue: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    { label: 'In 1 month', getValue: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  ];

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative', ...style }}>
      {label && (
        <label className="field__label">
          {label.toUpperCase()}
          {required && <span style={{ color: 'var(--color-error)', marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}

      {/* Input Field */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="input"
        style={{
          width: '100%',
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: isOpen ? 'var(--color-surface-raised)' : 'transparent',
          fontSize: 'clamp(0.875rem, 0.9375rem, 1rem)',
        }}
      >
        <span style={{ color: selectedDate ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
          {selectedDate ? formatDisplayValue(selectedDate) : placeholder}
        </span>
        <span style={{ fontSize: '1rem', opacity: 0.6 }}>📅</span>
      </button>

      {/* Custom Dropdown */}
      {isOpen && (
        <div
          className="datetime-picker-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: 'var(--space-2)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 1000,
            padding: 'var(--space-4)',
            maxHeight: '25rem',
            overflowY: 'auto',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {/* Quick Options */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <div style={{
              fontSize: 'clamp(0.6875rem, 0.71875rem, 0.75rem)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-muted)',
              marginBottom: 'var(--space-2)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Quick Select
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {quickOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => {
                    const date = option.getValue();
                    handleDateSelect(date);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    background: 'transparent',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text)',
                    fontSize: 'clamp(0.8125rem, 0.84375rem, 0.875rem)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all var(--transition-base)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-surface-raised)';
                    e.currentTarget.style.borderColor = 'var(--color-accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Native Input (fallback) */}
          <div>
            <div style={{
              fontSize: 'clamp(0.6875rem, 0.71875rem, 0.75rem)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-muted)',
              marginBottom: 'var(--space-2)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              Custom Date & Time
            </div>
            <input
              type="datetime-local"
              className="input"
              value={selectedDate ? selectedDate.toISOString().slice(0, 16) : ''}
              onChange={(e) => {
                if (e.target.value) {
                  const date = new Date(e.target.value);
                  handleDateSelect(date);
                }
              }}
              style={{
                width: '100%',
                fontSize: 'clamp(0.875rem, 0.9375rem, 1rem)',
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-2)',
            marginTop: 'var(--space-4)',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid var(--color-border)',
          }}>
            <button
              type="button"
              onClick={() => {
                setSelectedDate(null);
                onChange(null);
                setIsOpen(false);
              }}
              className="btn btn--secondary"
              style={{
                flex: 1,
                fontSize: 'clamp(0.75rem, 0.8125rem, 0.875rem)',
              }}
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="btn"
              style={{
                flex: 1,
                fontSize: 'clamp(0.75rem, 0.8125rem, 0.875rem)',
                background: 'var(--color-accent)',
                color: '#000',
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {hint && (
        <p style={{
          fontSize: 'clamp(0.6875rem, 0.75rem, 0.8125rem)',
          color: 'var(--color-text-muted)',
          marginTop: 'var(--space-2)',
          marginBottom: 0,
        }}>
          {hint}
        </p>
      )}
    </div>
  );
}

