import React, { useState, useEffect } from 'react';
import { formatTime, parseTimeString } from '../utils/dateUtils';

interface TimeEntryProps {
  hours: number;
  minutes: number;
  onChange: (hours: number, minutes: number) => void;
  isActive?: boolean;
}

export const TimeEntry: React.FC<TimeEntryProps> = ({
  hours,
  minutes,
  onChange,
  isActive = false
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setValue(formatTime(hours, minutes));
    }
  }, [hours, minutes, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    if (hours === 0 && minutes === 0) {
      setValue('');
    } else {
      setValue(formatTime(hours, minutes));
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const { hours: newHours, minutes: newMinutes } = parseTimeString(value);
    onChange(newHours, newMinutes);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <input
      type="text"
      value={isFocused ? value : (hours === 0 && minutes === 0 ? 'hh:mm' : formatTime(hours, minutes))}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder="hh:mm"
      className={`
        w-full px-2 py-1 text-center border rounded
        ${isActive ? 'bg-green-50 border-green-300' : 'border-gray-300'}
        ${(hours > 0 || minutes > 0) ? 'text-gray-900' : 'text-gray-400'}
        hover:border-gray-400 focus:border-blue-500 focus:outline-none
        transition-colors duration-200
      `}
    />
  );
};