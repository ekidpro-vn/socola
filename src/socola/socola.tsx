import React from 'react';
import Select from 'react-select';
import { optionsStatus } from './socola.data';
import { SocolaProps } from './socola.types';

export const Socola: React.FC<SocolaProps> = () => {
  return (
    <div>
      {/* Input */}
      <div>
        <textarea
          placeholder="Type here..."
          className="w-full flex-1 flex items-center rounded py-2 overflow-hidden border px-3 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:border-blue-600 focus:outline-none"
        />
      </div>

      {/* Control */}
      <div className="grid grid-cols-2 mt-3">
        <div className="col-span-1 grid grid-cols-3 gap-x-5">
          <div className="col-span-1 grid grid-cols-3 gap-x-3">
            <button className="col-span-1 hover:bg-indigo-50 duration-300 rounded w-10 h-10 flex justify-center items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button className="col-span-1 hover:bg-indigo-50 duration-300 rounded w-10 h-10 flex justify-center items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button className="col-span-1 hover:bg-indigo-50 duration-300 rounded w-10 h-10 flex justify-center items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>

          <div className="col-span-1">
            <input
              placeholder="Date"
              className="appearance-none block w-full text-gray-700 border border-gray-300 rounded py-1.5 px-3 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1"
              type="date"
            />
          </div>

          <div className="col-span-1">
            <Select options={optionsStatus} placeholder="Status" />
          </div>
        </div>

        <div className="col-span-1 flex items-center justify-end">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">POST</button>
        </div>
      </div>

      {/* Comment  */}
      <div className="mt-10">
        <div className="flex items-start">
          <img src="https://cms-staging.ekidpro.com/media/default-avatar.svg" className="w-12 h-12 rounded-full" />
          <div className="ml-4">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <span className="block font-semibold text-blue-800">Nguyễn Hồng Đức</span>
              <span className="block">test test test test test</span>
            </div>
            <div className="flex items-center mt-1">
              <button className="text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button className="mx-3 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <span className="block opacity-50">1 phút trước</span>
            </div>

            <div className="flex items-start mt-4">
              <img src="https://cms-staging.ekidpro.com/media/default-avatar.svg" className="w-9 h-9 rounded-full" />
              <div className="ml-4">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div>
                    <span className="font-semibold mr-2 text-blue-800">Nguyễn Hồng Đức</span>
                    <span>test test test test test</span>
                  </div>
                </div>
                <div className="flex items-center mt-1">
                  <button className="text-gray-500 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <span className="block opacity-50">1 phút trước</span>
                </div>
              </div>
            </div>

            <div className="flex items-start mt-4">
              <img src="https://cms-staging.ekidpro.com/media/default-avatar.svg" className="w-9 h-9 rounded-full" />
              <div className="ml-4">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div>
                    <span className="font-semibold mr-2 text-blue-800">Nguyễn Hồng Đức</span>
                    <span>test test test test test</span>
                  </div>
                </div>
                <div className="flex items-center mt-1">
                  <button className="text-gray-500 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <span className="block opacity-50">1 phút trước</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
