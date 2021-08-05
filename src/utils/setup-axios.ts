import axios from 'axios';
import { SOCOLA_URL } from '../config';

const source = axios.CancelToken.source();

export function setupAxios(socolaToken: string, apiDomain?: string) {
  axios.interceptors.request.use(
    (config) => {
      if (!config.url?.startsWith('https://')) {
        config.url = `${apiDomain || SOCOLA_URL}${config.url}`;
        config.params = {
          ...config.params,
          token: socolaToken,
        };
        config.timeout = 20000; // 20s
        config.cancelToken = source.token;
      }

      return config;
    },
    (error) => {
      // Do something with request error
      return Promise.reject(error);
    }
  );
}
