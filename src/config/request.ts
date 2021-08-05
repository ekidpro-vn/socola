import axios from 'axios';
import { SOCOLA_URL } from './index';

export const source = axios.CancelToken.source();

const request = axios.create({
  timeout: 20000,
  cancelToken: source.token,
});

export const setupAxios = (socolaToken: string, apiDomain?: string) => {
  request.interceptors.request.use(
    (config) => {
      if (!config.url?.startsWith('https://')) {
        config.url = `${apiDomain || SOCOLA_URL}${config.url}`;
        config.params = {
          ...config.params,
          token: socolaToken,
        };
      }

      return config;
    },
    (error) => {
      // Do something with request error
      return Promise.reject(error);
    }
  );
};

export default request;
