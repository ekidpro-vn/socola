import { FeedType } from 'types/feed';
import * as ACTIONS from './action';
import { Action } from './action';

export interface UploadImage {
  base64Url: string | ArrayBuffer;
  file?: File;
  id: string;
}

export interface State {
  feeds: FeedType[] | null;
  error?: string;
  loading?: boolean;
  uploadImages: UploadImage[];
}

export const initialState: State = {
  feeds: null,
  error: '',
  loading: false,
  uploadImages: [],
};

export function rootReducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case ACTIONS.ACTION_GET_FEEDS_SUCCESS:
      return { ...state, feeds: action.payload.data };

    case ACTIONS.ACTION_SET_NEW_FEEDS:
      return { ...state, feeds: action.payload.data };

    case ACTIONS.ACTION_SET_NEW_UPLOAD_IMAGE:
      return {
        ...state,
        uploadImages: [...state.uploadImages, action.payload.data],
      };

    case ACTIONS.ACTION_REMOVE_UPLOAD_IMAGE: {
      const newUploadImages = [...state.uploadImages].filter((item) => item.id !== action.payload.data);
      return {
        ...state,
        uploadImages: newUploadImages,
      };
    }

    default:
      return state;
  }
}
