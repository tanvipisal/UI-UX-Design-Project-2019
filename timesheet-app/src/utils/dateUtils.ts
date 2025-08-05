import { format, startOfWeek, endOfWeek, addDays, eachDayOfInterval } from 'date-fns';
import { WeekData } from '../types/timesheet';

export const getCurrentWeek = (): WeekData => {
  const today = new Date();
  const startDate = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const endDate = endOfWeek(today, { weekStartsOn: 1 }); // Sunday
  
  const days = eachDayOfInterval({ start: startDate, end: endDate })
    .map(day => format(day, 'yyyy-MM-dd'));
  
  return {
    startDate,
    endDate,
    days
  };
};

export const formatWeekRange = (startDate: Date, endDate: Date): string => {
  return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d yyyy')}`;
};

export const formatDayHeader = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'EEE, MMM d');
};

export const formatTime = (hours: number, minutes: number): string => {
  if (hours === 0 && minutes === 0) return '';
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
};

export const parseTimeString = (timeString: string): { hours: number; minutes: number } => {
  if (!timeString || timeString === 'hh:mm') return { hours: 0, minutes: 0 };
  
  const [hoursStr, minutesStr] = timeString.split(':');
  const hours = parseInt(hoursStr) || 0;
  const minutes = parseInt(minutesStr) || 0;
  
  return { hours, minutes };
};

export const formatElapsedTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};