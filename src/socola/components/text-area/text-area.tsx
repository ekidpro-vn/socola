import { Modal } from '@ekidpro/ui';
import axios from 'axios';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { get, isEmpty } from 'lodash';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { v4 as uuid } from 'uuid';
import { LoadingIcon } from '../../../assets/loading';
import { SendIcon } from '../../../assets/send-icon';
import { SECRET_KEY } from '../../../config';
import { removeAllUploadImage, removeUploadImage, setNewFeeds, setNewUploadImage } from '../../../store/action';
import { UploadImage } from '../../../store/type';
import { base64ToBlob, getDataDropdown, getFeeds, getProps } from '../../../utils/helper';
import { Camera } from '../camera';
import { optionsStatus } from './text-area.data';
import { TextAreaStyle } from './text-area.style';

export const TextArea: React.FC = () => {
  const dataProps = useSelector(getProps);
  const { channelId, showDate, showStatus, statusOption, moduleId, recordId } = dataProps;
  const [valueInput, setValueInput] = useState<string>('');
  const dispatch = useDispatch();
  const feeds = useSelector(getFeeds);
  const uploadImages: UploadImage[] | undefined = useSelector((state) => get(state, 'uploadImages'));
  const [status, setStatus] = useState<{ value: string | number; label: string }[]>([]);
  const [showModalCamera, setShowModalCamera] = useState<boolean>(false);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [datePickerType, setDatePickerType] = useState<'text' | 'date'>('text');
  const [loading, setLoading] = useState<boolean>(false);

  const onPostValue = useCallback(() => {
    if (!valueInput || loading) {
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.set('moduleid', moduleId);
    formData.set('recordid', recordId);
    formData.set('content', valueInput.trim());
    formData.set('islike', '1');
    formData.set('ispublic', isPublic ? '1' : '0');
    formData.set('secretkey', SECRET_KEY);

    if (channelId) {
      formData.set('channelid', channelId);
    }

    if (date) {
      formData.set('date', date.toDateString());
    }

    if (status && status.length > 0) {
      const statusValue = status.map((item) => item.value).join(',');
      formData.set('status', statusValue);
    }

    if (uploadImages && uploadImages.length > 0) {
      const list = [...uploadImages];
      for (let i = 0; i < list.length; i++) {
        const { file, base64Url } = list[i];
        if (!file) {
          formData.append(`image[${i}]`, base64ToBlob(`${base64Url}`), `camera_${i}`);
        } else if (file) {
          formData.append(`image[${i}]`, file, file.name);
        }
      }
    }

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
        setLoading(false);
        setValueInput('');
        setIsPublic(true);
        setDatePickerType('text');
        setDate(undefined);
        setStatus(undefined);
        dispatch(removeAllUploadImage());
        const newFeeds = [feeddata, ...feeds];
        dispatch(setNewFeeds(newFeeds));
      })
      .catch((error) => {
        toast.error(error.message, { autoClose: false });
        setLoading(false);
      });
  }, [valueInput, moduleId, recordId, dispatch, feeds, status, uploadImages, isPublic, date, channelId, loading]);

  const onUploadImages = useCallback(
    (files: FileList) => {
      Object.entries(files).map((item) => {
        const file = item[1];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          dispatch(
            setNewUploadImage({
              base64Url: reader.result,
              file,
              id: uuid(),
            })
          );
        };
        return null;
      });
    },
    [dispatch]
  );

  const onRemoveUploadImage = useCallback(
    (id: string) => {
      dispatch(removeUploadImage(id));
    },
    [dispatch]
  );

  const onCaptureCamera = useCallback(
    (data: string) => {
      setShowModalCamera(false);
      dispatch(
        setNewUploadImage({
          base64Url: data,
          id: uuid(),
        })
      );
    },
    [dispatch]
  );

  return (
    <TextAreaStyle>
      <div>
        <textarea
          value={valueInput}
          placeholder="Create new post..."
          rows={3}
          onChange={(e) => setValueInput(e.target.value)}
          className="w-full flex-1 flex items-center rounded py-2 overflow-hidden border px-3 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:border-blue-600 focus:outline-none"
        />
      </div>
      {!isEmpty(uploadImages) && (
        <div className="mt-3 flex items-center justify-start px-3">
          {Object.entries(uploadImages).map((item, index) => {
            const { base64Url, id } = item[1];

            return (
              <div className="relative mr-4 preview-image" key={`preview_${index}`}>
                <img src={`${base64Url}`} alt="preview" className="w-20 h-20 rounded object-cover" />
                <button
                  onClick={() => onRemoveUploadImage(id)}
                  className="absolute -top-1.5 -right-1.5 p-0.5 duration-300 text-white bg-red-600 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
      {/* Control */}
      <div className="mt-5">
        <div className="sm:flex sm:items-center w-full">
          <div className="flex items-center sm:mr-3 justify-center">
            <button className="hover:bg-indigo-50 duration-300 rounded w-10 h-10 text-gray-500 mr-2">
              <label htmlFor="file-input" className="w-full h-full flex justify-center items-center cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
              <input
                id="file-input"
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    onUploadImages(e.target.files);
                  }
                }}
              />
            </button>

            <button
              onClick={() => setShowModalCamera(true)}
              className="hover:bg-indigo-50 duration-300 rounded w-10 h-10 flex justify-center items-center text-gray-500 mr-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="h-10 flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-gray-600 block mr-0.5"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <span className="mr-3 text-gray-700 text-sm block">Public</span>
            </div>
          </div>
          <div className="sm:flex sm:items-center mt-4 sm:mt-0">
            {showDate && (
              <div className="sm:w-48 sm:mr-4 mb-3 sm:mb-0">
                <input
                  placeholder="Milestone"
                  className={clsx({
                    'block w-full text-gray-700 border border-gray-300 rounded px-3 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1':
                      true,
                    'py-1.5': datePickerType === 'date',
                    'placeholder-gray-500 py-2': datePickerType === 'text',
                  })}
                  type={datePickerType}
                  onFocus={() => setDatePickerType('date')}
                  onChange={(e) => setDate(dayjs(e.target.value, 'YYYY-MM-DD').toDate())}
                />
              </div>
            )}
            {showStatus && (
              <div className="sm:w-48">
                <Select
                  options={statusOption || optionsStatus}
                  isMulti
                  value={status}
                  placeholder="Tags"
                  onChange={(e) => setStatus(getDataDropdown(e))}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-3">
          <button
            onClick={onPostValue}
            className={clsx({
              'bg-green-600 text-white px-4 py-2 rounded duration-300 flex items-center justify-center': true,
              'opacity-70': !valueInput,
              'opacity-100': !!valueInput,
              'cursor-not-allowed': loading,
            })}
          >
            {loading ? <LoadingIcon className="w-4 h-4" /> : <SendIcon className="w-5 h-3.5" />}
            <span className="ml-1 font-medium">POST</span>
          </button>
        </div>
      </div>

      <Modal show={showModalCamera} size="lg" onClose={() => setShowModalCamera(false)}>
        <div className="flex items-center justify-between">
          <div />
          <span className="font-semibold uppercase block text-center text-xl">Please take a picture!</span>
          <button className="opacity-75 hover:opacity-100" onClick={() => setShowModalCamera(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="flex justify-center my-8">
          <Camera onCapture={onCaptureCamera} />
        </div>
      </Modal>
    </TextAreaStyle>
  );
};
