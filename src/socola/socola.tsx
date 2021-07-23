import axios from 'axios';
import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { SOCOLA_URL } from '../config';
import { rootReducer } from '../store/reducer';
import { FeedList } from './components/feed-list/feed-list';
import { TextArea } from './components/text-area';
import { SocolaProps } from './socola.types';

const middleWare = applyMiddleware(thunkMiddleware);

const store = createStore(rootReducer, middleWare);

export const source = axios.CancelToken.source();

export const Socola: React.FC<SocolaProps> = (props) => {
  const {
    moduleId,
    recordId,
    statusOption,
    showDate,
    showStatus,
    channelId,
    readOnly = false,
    renderType = 'social',
    infoUser,
    socolaToken,
  } = props;

  axios.interceptors.request.use((config) => {
    if (!config.url?.startsWith('https://')) {
      config.url = `${SOCOLA_URL}${config.url}`;
      config.params = {
        ...config.params,
        cancelToken: source.token,
        token: socolaToken,
      };
    }

    return config;
  });

  return (
    <Provider store={store}>
      <div>
        {!readOnly && (
          <TextArea
            moduleId={moduleId}
            recordId={recordId}
            channelId={channelId}
            showDate={showDate}
            showStatus={showStatus}
            statusOption={statusOption}
          />
        )}

        <FeedList moduleId={moduleId} recordId={recordId} channelId={channelId} />
      </div>
    </Provider>
  );
};
