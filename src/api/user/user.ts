import { http } from '@/utils/http/axios';
import { MapMessage } from '../messageMap';
import { RespHook } from '../respHook';

const API_URL = import.meta.env.VITE_BOBH_API_URL;

export interface LoginResponseModel<T = any> {
  code: number;
  message: string;
  where: string;
  user: T;
  map_message: string;
}

export interface LogoutResponseModel {
  code: number;
  message: string;
  where: string;
  map_message: string;
}

export interface UserinfoResponseModel<T = any> {
  code: number;
  message: string;
  user: T;
}

const UserInfoCache = {};

export function login(params): Promise<LoginResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<LoginResponseModel>(
        {
          url: API_URL + '/api/user/login',
          method: 'POST',
          params,
        },
        {
          isTransformResponse: false,
        }
      )
      .then((resp) => {
        resp['map_message'] = MapMessage(resp.message);
        resolve(resp);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getUserInfo(): Promise<UserinfoResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<UserinfoResponseModel>(
        {
          url: API_URL + '/api/user/userinfo',
          method: 'GET',
        },
        {
          isTransformResponse: false,
        }
      )
      .then((resp) => {
        resp['map_message'] = MapMessage(resp.message);
        RespHook(resp, () => {
          resolve(resp);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function logout(): Promise<LogoutResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<LogoutResponseModel>(
        {
          url: API_URL + '/api/user/logout',
          method: 'GET',
        },
        {
          isTransformResponse: false,
        }
      )
      .then((resp) => {
        resp['map_message'] = MapMessage(resp.message);
        resolve(resp);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getOtherUserInfo(userId: string): Promise<UserinfoResponseModel> {
  if (UserInfoCache.hasOwnProperty(userId)) {
    // console.log('Hit cache: ', UserInfoCache[userId]);
    return Promise.resolve(UserInfoCache[userId]);
  } else {
    return new Promise((resolve, reject) => {
      http
        .request<UserinfoResponseModel>(
          {
            url: API_URL + '/api/user/userinfo/' + userId,
            method: 'GET',
          },
          {
            isTransformResponse: false,
          }
        )
        .then((resp) => {
          resp['map_message'] = MapMessage(resp.message);
          RespHook(resp, () => {
            if (resp.code == 200) {
              UserInfoCache[userId] = resp;
            }
            resolve(resp);
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
