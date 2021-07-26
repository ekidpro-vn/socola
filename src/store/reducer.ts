import * as ACTIONS from './action';
import { Action } from './action';
import { State } from './type';

export const initialState: State = {
  feeds: null,
  error: '',
  loading: false,
  uploadImages: [],
  props: {
    moduleId: '',
    recordId: '',
    channelId: '',
    socolaToken: '',
    statusOption: [],
    showDate: true,
    showStatus: true,
    readOnly: false,
    renderType: 'social',
    userRole: '',
  },
};

export function rootReducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case ACTIONS.ACTION_SET_PROPS:
      return { ...state, props: action.payload.data };

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

    case ACTIONS.ACTION_REMOVE_ALL_UPLOAD_IMAGE: {
      return {
        ...state,
        uploadImages: [],
      };
    }

    default:
      return state;
  }
}
