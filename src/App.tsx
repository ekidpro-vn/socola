import React, { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-image-lightbox/style.css';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { setupAxios } from './config/request';
import { SocolaComponent } from './socola/socola';
import { rootReducer } from './store/reducer';
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Provider>
  );
}
