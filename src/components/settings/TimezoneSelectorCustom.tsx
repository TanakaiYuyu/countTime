/**
 * Custom TimezoneSelector Component
 * 
 * A fully custom timezone selector with styled dropdown UI.
 * Replaces native select with TelemetryOS-styled dropdown.
 */

import { useState, useRef, useEffect, useMemo } from 'react';
import { getAllTimezoneOptions, type TimezoneOption } from '../../utils/timezones';

interface TimezoneSelectorCustomProps {
  value: string;
  onChange: (timezone: string) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  hint?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function TimezoneSelectorCustom({
  value,
  onChange,
  label,
  disabled = false,
  required = false,
  hint,
  className,
  style,
}: TimezoneSelectorCustomProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get all timezone options
  const allTimezones = useMemo(() => getAllTimezoneOptions(), []);

  // Filter timezones based on search
  const filteredTimezones = useMemo(() => {
    if (!searchTerm.trim()) return allTimezones;
    
    const search = searchTerm.toLowerCase();
    return allTimezones.filter((tz: TimezoneOption) => 
      tz.label.toLowerCase().includes(search) || 
      tz.value.toLowerCase().includes(search) ||
      tz.offset.toLowerCase().includes(search)
    );
  }, [searchTerm, allTimezones]);

  // Get selected timezone
  const selectedTimezone = useMemo(() => {
    return allTimezones.find((tz: TimezoneOption) => tz.value === value);
  }, [value, allTimezones]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Focus search input when opening
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle timezone selection
  const handleSelect = (tz: TimezoneOption) => {
    onChange(tz.value);
    setIsOpen(false);
    setSearchTerm('');
  };

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
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedTimezone?.offset 
            ? `${selectedTimezone.label} ${selectedTimezone.offset}`
            : selectedTimezone?.label || 'Select timezone'}
        </span>
        <span style={{ fontSize: '1rem', opacity: 0.6, marginLeft: 'var(--space-2)' }}>
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {/* Custom Dropdown */}
      {isOpen && (
        <div
          className="timezone-dropdown"
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
            maxHeight: 'clamp(20rem, 25rem, 30rem)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'fadeIn 0.2s ease-out',
            overflow: 'hidden',
          }}
        >
          {/* Search Input */}
          <div style={{ 
            padding: 'var(--space-3)', 
            borderBottom: '1px solid var(--color-border)',
            flexShrink: 0,
          }}>
            <input
              ref={searchInputRef}
              type="text"
              className="input"
              placeholder="Search timezones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                fontSize: 'clamp(0.75rem, 0.8125rem, 0.875rem)',
                padding: 'var(--space-2) var(--space-3)',
              }}
            />
          </div>

          {/* All Timezones List */}
          <div style={{ 
            flex: '1 1 auto',
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: 'var(--space-2)',
            WebkitOverflowScrolling: 'touch',
          }}>
            {filteredTimezones.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                {filteredTimezones.map((tz: TimezoneOption) => (
                  <button
                    key={tz.value}
                    type="button"
                    onClick={() => handleSelect(tz)}
                    style={{
                      padding: 'var(--space-2)',
                      background: value === tz.value ? 'rgba(248, 179, 52, 0.1)' : 'transparent',
                      border: value === tz.value ? '1px solid var(--color-accent)' : '1px solid transparent',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text)',
                      fontSize: 'clamp(0.75rem, 0.78125rem, 0.8125rem)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all var(--transition-base)',
                    }}
                    onMouseEnter={(e) => {
                      if (value !== tz.value) {
                        e.currentTarget.style.background = 'var(--color-surface-raised)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (value !== tz.value) {
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{tz.label}</span>
                      {tz.offset && (
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9em' }}>
                          {tz.offset}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div style={{
                padding: 'var(--space-4)',
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: 'clamp(0.8125rem, 0.84375rem, 0.875rem)',
              }}>
                No timezones found
              </div>
            )}
          </div>

          {/* Footer with count */}
          <div style={{
            padding: 'var(--space-2) var(--space-3)',
            borderTop: '1px solid var(--color-border)',
            fontSize: 'clamp(0.6875rem, 0.71875rem, 0.75rem)',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            background: searchTerm ? 'transparent' : 'var(--color-surface-raised)',
            flexShrink: 0,
          }}>
            {searchTerm 
              ? `${filteredTimezones.length} timezone${filteredTimezones.length !== 1 ? 's' : ''} found`
              : `${allTimezones.length} timezones available`
            }
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

