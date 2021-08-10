import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { setupAxios } from './config/request';
import { SocolaComponent } from './socola/socola';
import { rootReducer } from './store/reducer';
import './styles/react-datepicker.css';
import './styles/tailwind.css';
import { SocolaProps } from './types/socola';

const middleWare = applyMiddleware(thunkMiddleware);
const store = createStore(rootReducer, middleWare);

export function Socola(props: SocolaProps): JSX.Element {
  const { socolaToken, apiDomain } = props;

  useEffect(() => {
    if (socolaToken) {
      setupAxios(socolaToken, apiDomain);
    }
  }, [socolaToken, apiDomain]);

  return (
    <Provider store={store}>
      <SocolaComponent {...props} />
    </Provider>
  );
}
