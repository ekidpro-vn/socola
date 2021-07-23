import { FeedType } from 'types/feed';
import * as ACTIONS from './action';
import { Action } from './action';

export interface State {
  feeds: FeedType[] | null;
  error?: string;
  loading?: boolean;
}

export const initialState: State = {
  feeds: null,
  error: '',
  loading: false,
};

export function rootReducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case ACTIONS.ACTION_GET_FEEDS_SUCCESS:
      return { ...state, feeds: action.payload.data };

    case ACTIONS.ACTION_SET_NEW_FEEDS:
      return { ...state, feeds: action.payload.data };

    default:
      return state;
  }
}
