import { useState, useEffect, useRef } from 'react';
import { Timer } from '../types/timesheet';

export const useTimer = () => {
  const [timer, setTimer] = useState<Timer>({
    isRunning: false,
    elapsedSeconds: 0
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    if (timer.isRunning) {
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const now = new Date();
          const elapsed = Math.floor((now.getTime() - startTimeRef.current.getTime()) / 1000);
          setTimer(prev => ({ ...prev, elapsedSeconds: elapsed }));
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning]);

  const startTimer = (rowId?: string) => {
    const now = new Date();
    startTimeRef.current = now;
    setTimer({
      isRunning: true,
      startTime: now,
      rowId,
      elapsedSeconds: 0
    });
  };

  const stopTimer = (): { elapsedSeconds: number; rowId?: string } => {
    const result = {
      elapsedSeconds: timer.elapsedSeconds,
      rowId: timer.rowId
    };
    
    setTimer({
      isRunning: false,
      elapsedSeconds: 0
    });
    
    startTimeRef.current = null;
    
    return result;
  };

  const resetTimer = () => {
    setTimer({
      isRunning: false,
      elapsedSeconds: 0
    });
    startTimeRef.current = null;
  };

  return {
    timer,
    startTimer,
    stopTimer,
    resetTimer
  };
};