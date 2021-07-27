import dayjs from 'dayjs';
import React from 'react';

export const FeedItemSubInfoMobile: React.FC<{ date: string; status: string }> = ({ date, status }) => {
  return (
    <div className="flex items-center justify-start mb-2">
      {date && (
        <div className="flex items-center justify-center mr-2">
          <span className="text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <span className="ml-2">{dayjs(date).format('DD/MM/YYYY')}</span>
        </div>
      )}

      {status && (
        <div>
          {status === 'NORMAL' && (
            <span className="px-3 py-1.5 bg-blue-50 text-blue-500 rounded-md block w-full text-center">Normal</span>
          )}
          {status === 'IMPORTANT' && (
            <span className="px-3 py-1.5 bg-red-50 text-red-500 rounded-md block w-full text-center">Important</span>
          )}
        </div>
      )}
    </div>
  );
};

export const FeedItemSubInfo: React.FC<{ date: string; status: string }> = ({ date, status }) => {
  return (
    <div className="flex items-start justify-end w-32">
      <div>
        {date && (
          <div className="flex items-center justify-center mb-2">
            <span className="text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <span className="ml-2">{dayjs(date).format('DD/MM/YYYY')}</span>
          </div>
        )}

        {status && (
          <div className="mt-2.5">
            {status === 'NORMAL' && (
              <span className="px-3 py-1.5 bg-blue-50 text-blue-500 rounded-md block w-full text-center">Normal</span>
            )}
            {status === 'IMPORTANT' && (
              <span className="px-3 py-1.5 bg-red-50 text-red-500 rounded-md block w-full text-center">Important</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
