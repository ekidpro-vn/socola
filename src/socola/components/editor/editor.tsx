import { Modal } from '@ekidpro/ui.modal';
import axios from 'axios';
import clsx from 'clsx';
import dayjs from 'dayjs';
import isEmpty from 'lodash.isempty';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { v4 as uuid } from 'uuid';
import { LoadingIcon } from '../../../assets/loading';
import { SendIcon } from '../../../assets/send-icon';
import request, { source } from '../../../config/request';
import {
  removeAllUploadImage,
  removeUploadImage,
  setError,
  setNewFeeds,
  setNewUploadImage,
} from '../../../store/action';
import { base64ToBlob, getDataDropdown, getError, getFeeds, getProps, getUploadImages } from '../../../utils/helper';
import { getTransformFeed } from '../../../utils/transform-data';
import { Camera } from '../camera';
import { optionsStatus } from './editor.data';
import { EditorStyle } from './editor.style';

const MAX_CAPACITY_ONE_IMAGE_UPLOAD = 2000000; // 2MB
const MAX_AMOUNT_IMAGE_UPLOAD = 5;

export const Editor: React.FC = () => {
  const dataProps = useSelector(getProps);
  const { channelId, showDate, showStatus, statusOption, moduleId, recordId, secretKey, onError } = dataProps;
  const [valueInput, setValueInput] = useState<string>('');
  const dispatch = useDispatch();
  const feeds = useSelector(getFeeds);
  const uploadImages = useSelector(getUploadImages);
  const [status, setStatus] = useState<{ value: string | number; label: string }[]>([]);
  const [showModalCamera, setShowModalCamera] = useState<boolean>(false);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [date, setDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessageUpload, setErrorMessageUpload] = useState<string>('');
  const [dateInputType, setDateInputType] = useState<'text' | 'date'>('text');
  const errorSocola = useSelector(getError);

  const resetInput = useCallback(() => {
    setValueInput('');
    setIsPublic(true);
    setDate(null);
    setDateInputType('text');
    setStatus([]);
    dispatch(removeAllUploadImage());
  }, [dispatch]);

  const onPostValue = useCallback(() => {
    if (!valueInput || loading || errorMessageUpload) {
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.set('moduleid', moduleId);
    formData.set('recordid', recordId);
    formData.set('content', valueInput.trim());
    formData.set('islike', '1');
    formData.set('ispublic', isPublic ? '1' : '0');
    formData.set('secretkey', secretKey);

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

    request
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
        resetInput();
        const transformFeedData = getTransformFeed(feeddata);
        const newFeeds = [transformFeedData, ...feeds];
        dispatch(setNewFeeds(newFeeds));
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          return;
        }
        let errorMessage: string = error.message ?? 'System error';
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        onError(errorMessage, 'post');
        dispatch(setError(errorMessage));
        setLoading(false);
      });

    return () => {
      source.cancel('Canceled by the user');
    };
  }, [
    valueInput,
    moduleId,
    recordId,
    dispatch,
    feeds,
    status,
    uploadImages,
    isPublic,
    date,
    channelId,
    loading,
    errorMessageUpload,
    secretKey,
    resetInput,
    onError,
  ]);

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

  useEffect(() => {
    if (uploadImages && uploadImages.length > MAX_AMOUNT_IMAGE_UPLOAD) {
      setErrorMessageUpload('Exceeded 5 photos on the post!');
    } else {
      const indexError: number[] = [];
      for (let i = 0; i < uploadImages.length; i++) {
        if (uploadImages[i].file && uploadImages[i].file.size > MAX_CAPACITY_ONE_IMAGE_UPLOAD) {
          indexError.push(i);
        }
      }
      if (indexError.length > 0) {
        setErrorMessageUpload(
          `Exceeds 2MB in ${indexError.length === 1 ? 'photo' : 'photos'} with positions ${indexError
            .map((item) => item + 1)
            .join(', ')}!`
        );
      } else {
        setErrorMessageUpload('');
      }
    }
  }, [uploadImages]);

  useEffect(() => {
    if (dateInputType === 'date') {
      console.clear();
    }
  }, [dateInputType]);

  return (
    <EditorStyle>
      <div>
        <textarea
          value={valueInput}
          placeholder="Create new post..."
          rows={3}
          disabled={loading}
          onChange={(e) => setValueInput(e.target.value)}
          className="w-full flex-1 flex items-center rounded py-2 overflow-hidden border px-3 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:border-blue-600 focus:outline-none"
        />
      </div>

      {!isEmpty(uploadImages) && (
        <div>
          <div className="mt-3 flex items-center justify-start px-3">
            {Object.entries(uploadImages).map((item, index) => {
              const { base64Url, id } = item[1];

              return (
                <div className="relative mr-4 preview-image" key={`preview_${index}`}>
                  <img src={`${base64Url}`} alt="preview" className="w-20 h-20 rounded object-cover" />
                  <button
                    onClick={() => onRemoveUploadImage(id)}
                    className="focus:outline-none absolute -top-1.5 -right-1.5 p-0.5 duration-300 text-white bg-red-600 rounded-full"
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
          {errorMessageUpload ? (
            <span className="block text-center text-red-500 italic mt-3">{errorMessageUpload}</span>
          ) : (
            <span className="block text-center text-gray-500 italic mt-3">
              Maximum size of 2MB per image and maximum of 5 images per post.
            </span>
          )}
        </div>
      )}

      {/* Control */}
      <div className="mt-5">
        <div className="sm:flex sm:items-center w-full">
          <div className="flex items-center sm:mr-3 justify-center">
            <button
              disabled={loading}
              className="focus:outline-none hover:bg-indigo-50 duration-300 rounded w-10 h-10 text-gray-500 mr-2"
            >
              <label htmlFor="file-input" className="w-full h-full flex justify-center items-center cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
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
              disabled={loading}
              onClick={() => setShowModalCamera(true)}
              className="focus:outline-none hover:bg-indigo-50 duration-300 rounded w-10 h-10 flex justify-center items-center text-gray-500 mr-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
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
                disabled={loading}
                className="form-checkbox h-5 w-5 text-gray-600 block mr-1"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <span className="mr-3 text-gray-700 text-sm block">Public</span>
            </div>
          </div>
          <div className="sm:flex sm:items-center mt-4 sm:mt-0">
            {showDate && (
              <div className="mr-3 w-full sm:w-48 mb-3 sm:mb-0">
                {dateInputType === 'text' ? (
                  <input
                    type="text"
                    className="milestone focus:outline-none border w-full border-gray-300 focus:border-blue-500 px-3 py-1.5 rounded"
                    value=""
                    readOnly
                    placeholder="Milestone"
                    onFocus={() => setDateInputType('date')}
                    disabled={loading}
                  />
                ) : (
                  <input
                    type="date"
                    onChange={(e) => setDate(dayjs(e.target.value).toDate())}
                    disabled={loading}
                    className="milestone focus:outline-none border w-full border-gray-300 focus:border-blue-500 px-3 py-1.5 rounded"
                  />
                )}
              </div>
            )}
            {showStatus && (
              <div className="sm:w-48">
                <Select
                  isDisabled={loading}
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
            disabled={loading}
            onClick={onPostValue}
            className={clsx({
              'bg-green-600 text-white px-4 py-2 rounded duration-300 flex items-center focus:outline-none justify-center':
                true,
              'opacity-70': !valueInput,
              'opacity-100': !!valueInput,
              'cursor-not-allowed': loading || errorMessageUpload,
            })}
          >
            {loading ? <LoadingIcon className="w-4 h-4" /> : <SendIcon className="w-5 h-3.5" />}
            <span className="ml-1 font-medium">POST</span>
          </button>
        </div>
        {errorSocola && (
          <div className="my-4 flex justify-end">
            <span className="block text-red-500">Error: {errorSocola}</span>
          </div>
        )}
      </div>

      <Modal show={showModalCamera} size="lg" zIndex={9999} onClose={() => setShowModalCamera(false)}>
        <div className="flex items-center justify-between">
          <div />
          <span className="font-semibold uppercase block text-center text-xl">Please take a picture!</span>
          <button className="focus:outline-none opacity-75 hover:opacity-100" onClick={() => setShowModalCamera(false)}>
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
    </EditorStyle>
  );
};
