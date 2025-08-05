import React from 'react';
import { Play, Square, User, Settings } from 'lucide-react';
import { formatElapsedTime } from '../utils/dateUtils';

interface TimerControlsProps {
  isRunning: boolean;
  elapsedSeconds: number;
  onStart: () => void;
  onStop: () => void;
  userName?: string;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  elapsedSeconds,
  onStart,
  onStop,
  userName = "Jules Winnfield"
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      {/* Mobile layout */}
      <div className="flex flex-col space-y-4 lg:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Weekly timesheet</h1>
          <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={onStop}
              disabled={!isRunning}
              className={`
                flex items-center px-3 py-2 rounded text-sm font-medium
                ${isRunning 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
                transition-colors duration-200
              `}
            >
              <Square className="w-4 h-4 mr-1" />
              Stop
            </button>
            
            <button
              onClick={onStart}
              disabled={isRunning}
              className={`
                flex items-center px-3 py-2 rounded text-sm font-medium
                ${!isRunning 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
                transition-colors duration-200
              `}
            >
              <Play className="w-4 h-4 mr-1" />
              Start new
            </button>
          </div>
          
          <div className="text-lg font-mono text-green-600">
            {formatElapsedTime(elapsedSeconds)}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-700">
            <User className="w-4 h-4" />
            <span className="text-sm">{userName}</span>
            <span className="text-xs text-gray-500">(me)</span>
          </div>
          <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
            timesheet...
          </span>
        </div>
      </div>
      
      {/* Desktop layout */}
      <div className="hidden lg:flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">Weekly timesheet</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={onStop}
              disabled={!isRunning}
              className={`
                flex items-center px-3 py-2 rounded text-sm font-medium
                ${isRunning 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
                transition-colors duration-200
              `}
            >
              <Square className="w-4 h-4 mr-1" />
              Stop
            </button>
            
            <button
              onClick={onStart}
              disabled={isRunning}
              className={`
                flex items-center px-3 py-2 rounded text-sm font-medium
                ${!isRunning 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
                transition-colors duration-200
              `}
            >
              <Play className="w-4 h-4 mr-1" />
              Start new
            </button>
          </div>
          
          <div className="text-xl font-mono text-green-600">
            {formatElapsedTime(elapsedSeconds)}
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
              timesheet...
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 text-gray-700">
              <User className="w-4 h-4" />
              <span className="text-sm">{userName}</span>
              <span className="text-xs text-gray-500">(me)</span>
            </div>
            <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
};