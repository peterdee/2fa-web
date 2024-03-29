import axios from 'axios';
import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

import { BACKEND_URL } from '../constants';

interface RequestOptions {
  data?: object;
  method: string;
  token?: string;
  url: string;
}

export interface ResponsePayload<T = null> {
  data?: T;
  datetime: number;
  handling: number;
  info: string;
  request: string;
  status: number;
}

export type ResponseError = AxiosError<ResponsePayload>;

const METHODS = {
  delete: 'DELETE',
  get: 'GET',
  patch: 'PATCH',
  post: 'POST',
};

export const ENDPOINTS = {
  changePassword: {
    method: METHODS.patch,
    url: '/api/password',
  },
  changeRecoveryData: {
    method: METHODS.patch,
    url: '/api/account/recovery-data',
  },
  deleteAccount: {
    method: METHODS.delete,
    url: '/api/account',
  },
  getAuthCode: {
    method: METHODS.get,
    url: '/api/auth/code',
  },
  getSecrets: {
    method: METHODS.get,
    url: '/api/secrets',
  },
  logout: {
    method: METHODS.get,
    url: '/api/auth/logout',
  },
  recoveryCheck: {
    method: METHODS.post,
    url: '/api/recovery/check',
  },
  recoveryUpdate: {
    method: METHODS.patch,
    url: '/api/recovery/update',
  },
  signIn: {
    method: METHODS.post,
    url: '/api/auth/sign-in',
  },
  signUp: {
    method: METHODS.post,
    url: '/api/auth/sign-up',
  },
};

export default async function request<T = null>(
  options: RequestOptions,
): Promise<AxiosResponse<ResponsePayload<T>>> {
  const config: AxiosRequestConfig = {
    method: options.method,
    url: `${BACKEND_URL}${options.url}`,
  };

  if (options.data) {
    config.data = options.data;
  }
  if (options.token) {
    config.headers = {
      Authorization: options.token,
    };
  }

  return axios({
    ...config,
  });
}
