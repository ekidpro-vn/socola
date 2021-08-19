import * as ACTIONS from './action';
import { Action } from './action';
import { State } from './type';

export const initialState: State = {
  feeds: undefined,
  error: '',
  loading: false,
  uploadImages: [],
  scrollTop: false,
  props: {
    moduleId: '',
    recordId: '',
    channelId: '',
    token: '',
    statusOption: [],
    showDate: true,
    showStatus: true,
    readOnly: false,
    renderType: 'social',
    userInfo: {
      id: 0,
      type: '',
    },
    secretKey: '',
  },
  paginationFeed: {
    totalItems: 0,
    totalPages: 0,
    page: 1,
    size: 10,
  },
};

export function rootReducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case ACTIONS.ACTION_SET_PROPS:
      return { ...state, props: action.payload.data, error: '' };

    case ACTIONS.ACTION_GET_FEEDS_SUCCESS:
      return { ...state, feeds: action.payload.data, error: '' };

    case ACTIONS.ACTION_SET_FEEDS_NULL: {
      return { ...state, feeds: null, error: action.payload.data };
    }

    case ACTIONS.ACTION_SET_NEW_FEEDS:
      return { ...state, feeds: action.payload.data, error: '' };

    case ACTIONS.ACTION_SET_NEW_UPLOAD_IMAGE:
      return {
        ...state,
        uploadImages: [...state.uploadImages, action.payload.data],
        error: '',
      };

    case ACTIONS.ACTION_REMOVE_UPLOAD_IMAGE: {
      const newUploadImages = [...state.uploadImages].filter((item) => item.id !== action.payload.data);
      return {
        ...state,
        uploadImages: newUploadImages,
        error: '',
      };
    }

    case ACTIONS.ACTION_REMOVE_ALL_UPLOAD_IMAGE: {
      return {
        ...state,
        uploadImages: [],
        error: '',
      };
    }

    case ACTIONS.ACTION_SET_PAGINATION_FEED: {
      return {
        ...state,
        paginationFeed: action.payload.data,
        error: '',
      };
    }

    case ACTIONS.ACTION_SET_SCROLL_TOP: {
      return {
        ...state,
        scrollTop: action.payload.data,
        error: '',
      };
    }

    case ACTIONS.ACTION_SET_ERROR: {
      return {
        ...state,
        error: action.payload.data,
      };
    }

    default:
      return state;
  }
}
