import axios from 'axios';
import clsx from 'clsx';
import get from 'lodash.get';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { SECRET_KEY } from '../../../config';
import { setNewFeeds } from '../../../store/action';
import { optionsStatus } from './text-area.data';
import { TextAreaProps } from './text-area.type';

export const TextArea: React.FC<TextAreaProps> = (props) => {
  const { channelId, showDate, showStatus, statusOption, moduleId, recordId } = props;
  const [valueInput, setValueInput] = useState<string>('');
  const dispatch = useDispatch();
  const feeds = useSelector((state) => get(state, 'feeds'));

  const onPostValue = useCallback(() => {
    const formData = new FormData();
    formData.set('moduleid', moduleId);
    formData.set('recordid', recordId);
    formData.set('content', valueInput);
    formData.set('date', '');
    formData.set('status', '');
    formData.set('islike', '1');
    formData.set('ispublic', '1');
    formData.set('secretkey', SECRET_KEY);

    axios
      .post('/api/feed/newfeed', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        const { success, feeddata, message } = response.data;
        if (!success || response.status > 400) {
          throw new Error(message || 'Post failed');
        }
        const newFeeds = [feeddata, ...feeds];
        dispatch(setNewFeeds(newFeeds));
      })
      .catch((error) => console.log(error.message));
  }, [valueInput, moduleId, recordId]);

  return (
    <div>
      <div>
        <textarea
          value={valueInput}
          placeholder="Type here..."
          rows={3}
          onChange={(e) => setValueInput(e.target.value)}
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

          {showDate && (
            <div className="col-span-1">
              <input
                placeholder="Date"
                className="appearance-none block w-full text-gray-700 border border-gray-300 rounded py-1.5 px-3 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1"
                type="date"
              />
            </div>
          )}

          {showStatus && (
            <div className="col-span-1">
              <Select options={statusOption || optionsStatus} placeholder="Status" />
            </div>
          )}
        </div>

        <div className="col-span-1 flex items-center justify-end">
          <button
            onClick={onPostValue}
            className={clsx({
              'bg-blue-600 text-white px-4 py-2 rounded duration-300': true,
              'opacity-70': !valueInput,
              'opacity-100': !!valueInput,
            })}
          >
            POST
          </button>
        </div>
      </div>
    </div>
  );
};
