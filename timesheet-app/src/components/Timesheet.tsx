import React, { useState, useEffect } from 'react';
import { Plus, Copy } from 'lucide-react';
import { TimesheetRow, WeekData } from '../types/timesheet';
import { getCurrentWeek } from '../utils/dateUtils';
import { useTimer } from '../hooks/useTimer';
import { TimerControls } from './TimerControls';
import { WeekNavigation } from './WeekNavigation';
import { TimesheetRowComponent } from './TimesheetRow';
import { ResponsiveTimesheet } from './ResponsiveTimesheet';

const initialData: TimesheetRow[] = [
  {
    id: '1',
    client: 'Quentin - New Website project',
    project: 'Quentin - New Website project',
    task: 'Gather media material',
    entries: [
      { id: '1-mon', day: '2022-10-03', hours: 5, minutes: 15 },
      { id: '1-tue', day: '2022-10-04', hours: 2, minutes: 30 },
      { id: '1-wed', day: '2022-10-05', hours: 1, minutes: 30 },
      { id: '1-thu', day: '2022-10-06', hours: 0, minutes: 0 },
      { id: '1-fri', day: '2022-10-07', hours: 0, minutes: 0 },
    ]
  },
  {
    id: '2',
    client: 'Quentin - New Website project',
    project: 'Quentin - New Website project',
    task: '',
    entries: [
      { id: '2-thu', day: '2022-10-06', hours: 2, minutes: 15 },
      { id: '2-fri', day: '2022-10-07', hours: 0, minutes: 30 },
    ]
  },
  {
    id: '3',
    client: 'Not billable',
    project: 'Not billable',
    task: 'Admin (docs, reporting)',
    entries: [
      { id: '3-mon', day: '2022-10-03', hours: 0, minutes: 45 },
      { id: '3-wed', day: '2022-10-05', hours: 0, minutes: 30 },
    ]
  },
  {
    id: '4',
    client: 'Read Ezekiel 25:17 to Brett',
    project: 'Read Ezekiel 25:17 to Brett',
    task: '',
    entries: [
      { id: '4-fri', day: '2022-10-07', hours: 0, minutes: 15 },
    ]
  },
  {
    id: '5',
    client: "Jack Rabbit Slim's - Social media management",
    project: "Jack Rabbit Slim's - Social media management",
    task: 'Edit raw images in Photoshop',
    entries: [
      { id: '5-mon', day: '2022-10-03', hours: 3, minutes: 0 },
      { id: '5-tue', day: '2022-10-04', hours: 4, minutes: 0 },
      { id: '5-wed', day: '2022-10-05', hours: 5, minutes: 30 },
      { id: '5-thu', day: '2022-10-06', hours: 6, minutes: 0 },
      { id: '5-fri', day: '2022-10-07', hours: 7, minutes: 0 },
    ]
  },
  {
    id: '6',
    client: "Jack Rabbit Slim's - Social media management",
    project: "Jack Rabbit Slim's - Social media management",
    task: 'Post images to socials',
    entries: [
      { id: '6-mon', day: '2022-10-03', hours: 1, minutes: 30 },
      { id: '6-tue', day: '2022-10-04', hours: 2, minutes: 15 },
    ]
  },
  {
    id: '7',
    client: 'Quentin - New Website project',
    project: 'Quentin - New Website project',
    task: 'Develop a Wordpress site',
    entries: []
  },
  {
    id: '8',
    client: '',
    project: '',
    task: '',
    entries: []
  },
  {
    id: '9',
    client: '',
    project: '',
    task: '',
    entries: []
  }
];

export const Timesheet: React.FC = () => {
  const [weekData, setWeekData] = useState<WeekData>(getCurrentWeek());
  const [rows, setRows] = useState<TimesheetRow[]>(initialData);
  const { timer, startTimer, stopTimer } = useTimer();

  const handleUpdateEntry = (rowId: string, day: string, hours: number, minutes: number) => {
    setRows(prevRows => 
      prevRows.map(row => {
        if (row.id === rowId) {
          const existingEntryIndex = row.entries.findIndex(entry => entry.day === day);
          const newEntry = { id: `${rowId}-${day}`, day, hours, minutes };
          
          if (existingEntryIndex >= 0) {
            // Update existing entry
            const newEntries = [...row.entries];
            newEntries[existingEntryIndex] = newEntry;
            return { ...row, entries: newEntries };
          } else {
            // Add new entry
            return { ...row, entries: [...row.entries, newEntry] };
          }
        }
        return row;
      })
    );
  };

  const handleUpdateRow = (rowId: string, updates: Partial<TimesheetRow>) => {
    setRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId ? { ...row, ...updates } : row
      )
    );
  };

  const handleStartTimer = () => {
    startTimer();
  };

  const handleStopTimer = () => {
    const result = stopTimer();
    // Convert elapsed seconds to hours and minutes and add to current active row
    if (result.elapsedSeconds > 0) {
      const hours = Math.floor(result.elapsedSeconds / 3600);
      const minutes = Math.floor((result.elapsedSeconds % 3600) / 60);
      
      // For demo, add to first non-empty row or create a new one
      const targetRow = rows.find(row => row.client && row.client !== '');
      if (targetRow) {
        const today = new Date().toISOString().split('T')[0];
        const existingEntry = targetRow.entries.find(entry => entry.day === today);
        if (existingEntry) {
          handleUpdateEntry(targetRow.id, today, existingEntry.hours + hours, existingEntry.minutes + minutes);
        } else {
          handleUpdateEntry(targetRow.id, today, hours, minutes);
        }
      }
    }
  };

  const handlePreviousWeek = () => {
    // Week navigation logic would go here
    console.log('Previous week');
  };

  const handleNextWeek = () => {
    // Week navigation logic would go here
    console.log('Next week');
  };

  const addTimesheetRow = () => {
    const newRow: TimesheetRow = {
      id: `new-${Date.now()}`,
      client: '',
      project: '',
      task: '',
      entries: []
    };
    setRows([...rows, newRow]);
  };

  const copyPreviousWeek = () => {
    // Logic to copy previous week's data
    console.log('Copy previous week');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TimerControls
        isRunning={timer.isRunning}
        elapsedSeconds={timer.elapsedSeconds}
        onStart={handleStartTimer}
        onStop={handleStopTimer}
      />
      
      <WeekNavigation
        weekData={weekData}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
      />
      
      {/* Desktop table view */}
      <div className="hidden lg:block bg-white">
        {rows.map(row => (
          <TimesheetRowComponent
            key={row.id}
            row={row}
            weekDays={weekData.days}
            onUpdateEntry={handleUpdateEntry}
            onUpdateRow={handleUpdateRow}
            isActive={timer.isRunning && timer.rowId === row.id}
          />
        ))}
      </div>
      
      {/* Mobile accordion view */}
      <ResponsiveTimesheet
        rows={rows}
        weekDays={weekData.days}
        onUpdateEntry={handleUpdateEntry}
        onUpdateRow={handleUpdateRow}
        activeRowId={timer.isRunning ? timer.rowId : undefined}
      />
      
      {/* Add row buttons */}
      <div className="bg-white border-t border-gray-200">
        <div className="flex items-center space-x-4 px-6 py-4">
          <button
            onClick={addTimesheetRow}
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add timesheet row
          </button>
          
          <button
            onClick={copyPreviousWeek}
            className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <Copy className="w-4 h-4 mr-1" />
            Copy previous week
          </button>
        </div>
      </div>
    </div>
  );
};