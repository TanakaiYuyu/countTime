import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (value: string) => void;
  className?: string;
}

export default function DatePicker({ value, onChange, className = '' }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse value or use today - memoize to avoid dependency issues
  const selectedDate = useMemo(() => {
    return value ? new Date(value + 'T00:00:00') : null;
  }, [value]);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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

  // Initialize current month from selected date or today
  useEffect(() => {
    if (selectedDate) {
      // Use setTimeout to avoid calling setState synchronously in effect
      setTimeout(() => {
        setCurrentMonth(new Date(selectedDate));
      }, 0);
    }
  }, [value, selectedDate]);

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onChange(formatDateForInput(newDate));
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleToday = () => {
    onChange(formatDateForInput(today));
    setIsOpen(false);
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days: (number | null)[] = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div ref={containerRef} className={`date-picker-container ${className}`}>
      <input
        type="text"
        readOnly
        value={selectedDate ? formatDisplayDate(selectedDate) : ''}
        onClick={() => setIsOpen(!isOpen)}
        placeholder="Select a date"
        className="input input--date h-full"
        style={{ cursor: 'pointer' }}
      />
      
      {isOpen && (
        <div
          className="date-picker-popup"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '0.25rem',
            zIndex: 1000,
            backgroundColor: 'var(--color-surface)',
            border: 'var(--border-width) solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            padding: 'var(--space-4)',
            minWidth: '18rem',
          }}
        >
          {/* Header with month navigation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-4)',
            }}
          >
            <button
              type="button"
              onClick={handlePrevMonth}
              className="btn btn--secondary"
              style={{
                padding: 'var(--space-2)',
                minWidth: 'auto',
                height: 'auto',
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <div
              style={{
                fontWeight: 'var(--font-weight-semibold)',
                fontSize: 'var(--font-size-base)',
                color: 'var(--color-text)',
              }}
            >
              {monthName}
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="btn btn--secondary"
              style={{
                padding: 'var(--space-2)',
                minWidth: 'auto',
                height: 'auto',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Week day headers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '0.25rem',
              marginBottom: 'var(--space-2)',
            }}
          >
            {weekDays.map((day) => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-muted)',
                  padding: 'var(--space-2)',
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '0.25rem',
            }}
          >
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} />;
              }

              const cellDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const isSelected =
                selectedDate &&
                cellDate.getTime() === selectedDate.getTime();
              const isToday = cellDate.getTime() === today.getTime();
              const isPast = cellDate < today;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  disabled={isPast}
                  className="date-picker-day"
                  style={{
                    aspectRatio: '1',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isSelected
                      ? 'var(--color-accent)'
                      : isToday
                      ? 'var(--color-surface-raised)'
                      : 'transparent',
                    color: isSelected
                      ? '#FFFFFF'
                      : isPast
                      ? 'var(--color-text-muted)'
                      : 'var(--color-text)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: isSelected || isToday ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                    cursor: isPast ? 'not-allowed' : 'pointer',
                    transition: 'all var(--transition-base)',
                    opacity: isPast ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={(e) => {
                    if (!isPast && !isSelected) {
                      e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isPast && !isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Today button */}
          <div
            style={{
              marginTop: 'var(--space-4)',
              paddingTop: 'var(--space-4)',
              borderTop: 'var(--border-width) solid var(--color-border)',
            }}
          >
            <button
              type="button"
              onClick={handleToday}
              className="btn btn--secondary"
              style={{
                width: '100%',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

