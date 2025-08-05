import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatWeekRange, formatDayHeader } from '../utils/dateUtils';
import { WeekData } from '../types/timesheet';

interface WeekNavigationProps {
  weekData: WeekData;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

export const WeekNavigation: React.FC<WeekNavigationProps> = ({
  weekData,
  onPreviousWeek,
  onNextWeek
}) => {
  const calculateTotalHours = () => {
    // This would normally calculate from actual data
    return "37:30";
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={onPreviousWeek}
              className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <span className="text-base sm:text-lg font-medium text-gray-900 min-w-0">
              <span className="hidden sm:inline">This week, </span>
              {formatWeekRange(weekData.startDate, weekData.endDate)}
            </span>
            
            <button
              onClick={onNextWeek}
              className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 whitespace-nowrap">
          <span className="hidden sm:inline">Total: </span>
          <span className="font-medium">{calculateTotalHours()}</span>
        </div>
      </div>
      
      {/* Day headers - only show on desktop */}
      <div className="hidden lg:grid grid-cols-12 gap-4 mt-4 text-sm">
        <div className="col-span-2 text-gray-700 font-medium">Client & Project</div>
        <div className="col-span-2 text-gray-700 font-medium">Task</div>
        {weekData.days.map((day, index) => (
          <div key={day} className="col-span-1 text-center">
            <div className="text-gray-700 font-medium">
              {formatDayHeader(day)}
            </div>
          </div>
        ))}
        <div className="col-span-1 text-center text-gray-700 font-medium">Total</div>
      </div>
    </div>
  );
};