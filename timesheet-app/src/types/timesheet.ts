export interface TimeEntry {
  id: string;
  day: string; // ISO date string
  hours: number;
  minutes: number;
}

export interface TimesheetRow {
  id: string;
  client: string;
  project: string;
  task: string;
  entries: TimeEntry[];
  isActive?: boolean;
}

export interface WeekData {
  startDate: Date;
  endDate: Date;
  days: string[]; // Array of ISO date strings
}

export interface Timer {
  isRunning: boolean;
  startTime?: Date;
  rowId?: string;
  elapsedSeconds: number;
}