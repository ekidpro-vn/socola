import axios from 'axios';
import React from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { SOCOLA_URL } from './config';
import { Socola } from './socola/socola';
import { rootReducer } from './store/reducer';
import { SocolaProps } from './types/socola';

const middleWare = applyMiddleware(thunkMiddleware);

const store = createStore(rootReducer, middleWare);

const App: React.FC<SocolaProps> = (props) => {
  axios.interceptors.request.use((config) => {
    if (!config.url?.startsWith('https://')) {
      config.url = `${SOCOLA_URL}${config.url}`;
      config.params = {
        ...config.params,
        token: props.socolaToken,
      };
    }

    return config;
  });

  return (
    <Provider store={store}>
      <Socola {...props} />
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
};

export default App;