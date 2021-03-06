import axios from 'axios';
import { Dispatch } from 'react';
import request from '../config/request';
import { FeedType } from '../types/feed';
import { getTransformFeeds } from '../utils/transform-data';
import { PaginationFeed, SetProps, UploadImage } from './type';

const source = axios.CancelToken.source();

export const ACTION_GET_FEEDS_SUCCESS = 'ACTION_GET_FEEDS_SUCCESS';
export const ACTION_SET_FEEDS_NULL = 'ACTION_SET_FEEDS_NULL';
export const ACTION_SET_NEW_FEEDS = 'ACTION_SET_NEW_FEEDS';
export const ACTION_SET_NEW_UPLOAD_IMAGE = 'ACTION_SET_NEW_UPLOAD_IMAGE';
export const ACTION_REMOVE_UPLOAD_IMAGE = 'ACTION_REMOVE_UPLOAD_IMAGE';
export const ACTION_REMOVE_ALL_UPLOAD_IMAGE = 'ACTION_REMOVE_ALL_UPLOAD_IMAGE';
export const ACTION_SET_PROPS = 'ACTION_SET_PROPS';
export const ACTION_SET_PAGINATION_FEED = 'ACTION_SET_PAGINATION_FEED';
export const ACTION_SET_SCROLL_TOP = 'ACTION_SET_SCROLL_TOP';
export const ACTION_SET_ERROR = 'ACTION_SET_ERROR';

const getFeedsFromApiSuccess = (data: FeedType[]) => {
  return <const>{
    type: ACTION_GET_FEEDS_SUCCESS,
    payload: { data },
  };
};

export const setFeedsNull = (error: string) => {
  return {
    type: ACTION_SET_FEEDS_NULL,
    payload: { data: error },
  };
};

export const setError = (data: string) => {
  return {
    type: ACTION_SET_ERROR,
    payload: { data },
  };
};

export const setPaginationFeed = (data: PaginationFeed) => {
  return <const>{
    type: ACTION_SET_PAGINATION_FEED,
    payload: { data },
  };
};

export const getFeedsFromApi = (
  moduleId?: string,
  recordId?: string,
  channelId?: string,
  page?: number,
  onError?: (e: string, type: 'get' | 'post' | 'put' | 'delete') => void
) => {
  return (dispatch: Dispatch<unknown>) => {
    request
      .get('/api/feed/getfeeds', {
        params: {
          moduleid: moduleId,
          recordid: recordId,
          channelid: channelId,
          page: page ?? 1,
          limit: 10,
        },
      })
      .then((response) => {
        const { success, feeds, message, total, page } = response.data;
        if (!success || response.status > 400) {
          throw new Error(message || 'Get feed list fail!');
        }
        const transformFeeds = getTransformFeeds(feeds);
        dispatch(getFeedsFromApiSuccess(transformFeeds));
        const totalItems = Number(total);
        const size = 10;
        const totalPages = totalItems % size === 0 ? totalItems / size : Math.ceil(totalItems / size);
        dispatch(
          setPaginationFeed({
            totalPages: totalPages ?? 0,
            totalItems,
            page: Number(page),
            size,
          })
        );
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
        dispatch(setFeedsNull(errorMessage));
      });

    return () => {
      source.cancel('Canceled by the user');
    };
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

export const setProps = (data: SetProps) => {
  return {
    type: ACTION_SET_PROPS,
    payload: { data },
  };
};

export const setScrollTop = (data: boolean) => {
  return {
    type: ACTION_SET_SCROLL_TOP,
    payload: { data },
  };
};

export type Action =
  | ReturnType<typeof getFeedsFromApiSuccess>
  | ReturnType<typeof setNewFeeds>
  | ReturnType<typeof setNewUploadImage>
  | ReturnType<typeof removeAllUploadImage>
  | ReturnType<typeof setScrollTop>
  | ReturnType<typeof setFeedsNull>
  | ReturnType<typeof setError>
  | ReturnType<typeof removeUploadImage>;
