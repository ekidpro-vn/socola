import dayjs from 'dayjs';
import React from 'react';

export const FeedItemSubInfo: React.FC<{ date: string; status: string }> = ({ date, status }) => {
  return (
    <div className="flex items-start justify-end">
      <div>
        {date && (
          <div className="flex items-center justify-center mb-2">
            <span className="text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span className="font-semibold ml-2">{dayjs(date).format('DD/MM/YYYY')}</span>
          </div>
        )}

        {status && (
          <div>
            {status === 'NORMAL' && (
              <span className="font-semibold ml-2 px-3 py-1.5 bg-yellow-100 text-yellow-500 rounded-md">Normal</span>
            )}
            {status === 'IMPORTANT' && (
              <span className="font-semibold ml-2 px-3 py-1.5 bg-purple-100 text-purple-500 rounded-md">Important</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
