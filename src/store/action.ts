import axios from 'axios';
import { Dispatch } from 'react';
import { FeedType } from '../types/feed';
import { UploadImage } from './reducer';

export const ACTION_GET_FEEDS_SUCCESS = 'ACTION_GET_FEEDS_SUCCESS';
export const ACTION_GET_FEEDS_ERROR = 'ACTION_GET_FEEDS_ERROR';
export const ACTION_SET_NEW_FEEDS = 'ACTION_SET_NEW_FEEDS';
export const ACTION_SET_NEW_UPLOAD_IMAGE = 'ACTION_SET_NEW_UPLOAD_IMAGE';
export const ACTION_REMOVE_UPLOAD_IMAGE = 'ACTION_REMOVE_UPLOAD_IMAGE';
export const ACTION_REMOVE_ALL_UPLOAD_IMAGE = 'ACTION_REMOVE_ALL_UPLOAD_IMAGE';

const getFeedsFromApiSuccess = (data: FeedType[]) => {
  return <const>{
    type: ACTION_GET_FEEDS_SUCCESS,
    payload: { data },
  };
};

const getFeedsFromApiError = (error: string) => {
  return <const>{
    type: ACTION_GET_FEEDS_ERROR,
    payload: { error },
  };
};

export const getFeedsFromApi = (moduleId?: string, recordId?: string, channelId?: string) => {
  return (dispatch: Dispatch<unknown>) => {
    axios
      .get('/api/feed/getfeeds', {
        params: {
          moduleid: moduleId,
          recordid: recordId,
          channelid: channelId,
        },
      })
      .then((response) => {
        const { success, feeds, message } = response.data;
        if (!success || response.status > 400) {
          throw new Error(message || 'Get feed list fail!');
        }
        dispatch(getFeedsFromApiSuccess(feeds));
      })
      .catch((error) => {
        dispatch(getFeedsFromApiError(error.message));
      });
  };
};

export const setNewFeeds = (data: FeedType[]) => {
  return <const>{
    type: ACTION_SET_NEW_FEEDS,
    payload: { data },
  };
};

export const setNewUploadImage = (data: UploadImage) => {
  return {
    type: ACTION_SET_NEW_UPLOAD_IMAGE,
    payload: { data },
  };
};

export const removeUploadImage = (data: string) => {
  return {
    type: ACTION_REMOVE_UPLOAD_IMAGE,
    payload: { data },
  };
};

export const removeAllUploadImage = () => {
  return {
    type: ACTION_REMOVE_ALL_UPLOAD_IMAGE,
    payload: { data: null },
  };
};

export type Action =
  | ReturnType<typeof getFeedsFromApiSuccess>
  | ReturnType<typeof getFeedsFromApiError>
  | ReturnType<typeof setNewFeeds>
  | ReturnType<typeof setNewUploadImage>
  | ReturnType<typeof removeAllUploadImage>
  | ReturnType<typeof removeUploadImage>;
