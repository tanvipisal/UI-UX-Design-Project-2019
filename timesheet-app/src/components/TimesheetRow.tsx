import React, { useState } from 'react';
import { TimesheetRow as TimesheetRowType, TimeEntry as TimeEntryType } from '../types/timesheet';
import { TimeEntry } from './TimeEntry';
import { formatTime } from '../utils/dateUtils';

interface TimesheetRowProps {
  row: TimesheetRowType;
  weekDays: string[];
  onUpdateEntry: (rowId: string, day: string, hours: number, minutes: number) => void;
  onUpdateRow: (rowId: string, updates: Partial<TimesheetRowType>) => void;
  isActive?: boolean;
}

export const TimesheetRowComponent: React.FC<TimesheetRowProps> = ({
  row,
  weekDays,
  onUpdateEntry,
  onUpdateRow,
  isActive = false
}) => {
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [clientValue, setClientValue] = useState(row.client);
  const [taskValue, setTaskValue] = useState(row.task);

  const getEntryForDay = (day: string): TimeEntryType => {
    return row.entries.find(entry => entry.day === day) || {
      id: `${row.id}-${day}`,
      day,
      hours: 0,
      minutes: 0
    };
  };

  const calculateRowTotal = (): { hours: number; minutes: number } => {
    let totalMinutes = 0;
    row.entries.forEach(entry => {
      totalMinutes += entry.hours * 60 + entry.minutes;
    });
    
    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60
    };
  };

  const handleClientEdit = () => {
    if (isEditingClient) {
      onUpdateRow(row.id, { client: clientValue });
      setIsEditingClient(false);
    } else {
      setIsEditingClient(true);
    }
  };

  const handleTaskEdit = () => {
    if (isEditingTask) {
      onUpdateRow(row.id, { task: taskValue });
      setIsEditingTask(false);
    } else {
      setIsEditingTask(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: 'client' | 'task') => {
    if (e.key === 'Enter') {
      if (type === 'client') {
        handleClientEdit();
      } else {
        handleTaskEdit();
      }
    } else if (e.key === 'Escape') {
      if (type === 'client') {
        setClientValue(row.client);
        setIsEditingClient(false);
      } else {
        setTaskValue(row.task);
        setIsEditingTask(false);
      }
    }
  };

  const rowTotal = calculateRowTotal();
  const isEmpty = row.client === '' || row.client.includes('Select/create');

  return (
    <div className={`grid grid-cols-12 gap-4 py-3 px-6 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${isActive ? 'bg-green-50' : ''}`}>
      {/* Client & Project */}
      <div className="col-span-2">
        {isEditingClient ? (
          <input
            type="text"
            value={clientValue}
            onChange={(e) => setClientValue(e.target.value)}
            onBlur={handleClientEdit}
            onKeyDown={(e) => handleKeyDown(e, 'client')}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            autoFocus
          />
        ) : (
          <div
            onClick={handleClientEdit}
            className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-100 ${isEmpty ? 'text-gray-400' : 'text-gray-900'}`}
          >
            {row.client || 'Select/create a project...'}
          </div>
        )}
      </div>

      {/* Task */}
      <div className="col-span-2">
        {isEditingTask ? (
          <input
            type="text"
            value={taskValue}
            onChange={(e) => setTaskValue(e.target.value)}
            onBlur={handleTaskEdit}
            onKeyDown={(e) => handleKeyDown(e, 'task')}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            autoFocus
          />
        ) : (
          <div
            onClick={handleTaskEdit}
            className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-100 ${isEmpty || !row.task ? 'text-gray-400' : 'text-gray-900'}`}
          >
            {row.task || 'Select/create a task...'}
          </div>
        )}
      </div>

      {/* Time entries for each day */}
      {weekDays.map(day => {
        const entry = getEntryForDay(day);
        return (
          <div key={day} className="col-span-1">
            <TimeEntry
              hours={entry.hours}
              minutes={entry.minutes}
              onChange={(hours, minutes) => onUpdateEntry(row.id, day, hours, minutes)}
              isActive={isActive}
            />
          </div>
        );
      })}

      {/* Total */}
      <div className="col-span-1 text-center py-1 text-gray-900 font-medium">
        {formatTime(rowTotal.hours, rowTotal.minutes)}
      </div>
    </div>
  );
};