import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TimesheetRow } from '../types/timesheet';
import { TimeEntry } from './TimeEntry';
import { formatTime, formatDayHeader } from '../utils/dateUtils';

interface ResponsiveTimesheetProps {
  rows: TimesheetRow[];
  weekDays: string[];
  onUpdateEntry: (rowId: string, day: string, hours: number, minutes: number) => void;
  onUpdateRow: (rowId: string, updates: Partial<TimesheetRow>) => void;
  activeRowId?: string;
}

export const ResponsiveTimesheet: React.FC<ResponsiveTimesheetProps> = ({
  rows,
  weekDays,
  onUpdateEntry,
  onUpdateRow,
  activeRowId
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (rowId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };

  const calculateRowTotal = (row: TimesheetRow): { hours: number; minutes: number } => {
    let totalMinutes = 0;
    row.entries.forEach(entry => {
      totalMinutes += entry.hours * 60 + entry.minutes;
    });
    
    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60
    };
  };

  const getEntryForDay = (row: TimesheetRow, day: string) => {
    return row.entries.find(entry => entry.day === day) || {
      id: `${row.id}-${day}`,
      day,
      hours: 0,
      minutes: 0
    };
  };

  return (
    <div className="lg:hidden">
      {rows.map(row => {
        const isExpanded = expandedRows.has(row.id);
        const isActive = activeRowId === row.id;
        const rowTotal = calculateRowTotal(row);
        const isEmpty = !row.client || row.client.includes('Select/create');

        return (
          <div
            key={row.id}
            className={`border-b border-gray-200 ${isActive ? 'bg-green-50' : 'bg-white'}`}
          >
            {/* Row header - always visible */}
            <div
              className="p-4 cursor-pointer"
              onClick={() => toggleRowExpansion(row.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className={`font-medium ${isEmpty ? 'text-gray-400' : 'text-gray-900'}`}>
                    {row.client || 'Select/create a project...'}
                  </div>
                  <div className={`text-sm mt-1 ${isEmpty || !row.task ? 'text-gray-400' : 'text-gray-600'}`}>
                    {row.task || 'Select/create a task...'}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {formatTime(rowTotal.hours, rowTotal.minutes)}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Expanded content - time entries */}
            {isExpanded && (
              <div className="px-4 pb-4 space-y-3">
                {weekDays.map(day => {
                  const entry = getEntryForDay(row, day);
                  return (
                    <div key={day} className="flex items-center justify-between">
                      <div className="text-sm text-gray-700 w-24">
                        {formatDayHeader(day)}
                      </div>
                      <div className="w-20">
                        <TimeEntry
                          hours={entry.hours}
                          minutes={entry.minutes}
                          onChange={(hours, minutes) => onUpdateEntry(row.id, day, hours, minutes)}
                          isActive={isActive}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};