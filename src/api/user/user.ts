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

export interface ChangePasswordResponseModel {
  code: number;
  message: string;
}

export interface SessionsResponseModel<T = any> {
  code: number;
  message: string;
  data: T[];
}

export interface UserListResponseModel<T = any> {
  code: number;
  message: string;
  data: T[];
}

export interface fido2RegOptionsResponseModel<T = any> {
  code: number;
  message: string;
  regOptions: T;
}

export interface fido2LoginOptionsResponseModel<T = any> {
  code: number;
  message: string;
  loginOptions: T;
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

export function changeMyPassword(params: any): Promise<ChangePasswordResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<ChangePasswordResponseModel>(
        {
          url: API_URL + '/api/user/changeMyPassword',
          method: 'POST',
          params,
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

export function getMySessions(): Promise<SessionsResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<SessionsResponseModel>(
        {
          url: API_URL + '/api/user/getSessions',
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

export function deleteMySession(sessionId): Promise<SessionsResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<SessionsResponseModel>(
        {
          url: API_URL + '/api/user/deleteSession',
          method: 'POST',
          params: { sessionId },
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

export function deleteAllMySession(): Promise<SessionsResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<SessionsResponseModel>(
        {
          url: API_URL + '/api/user/deleteAllSessions',
          method: 'POST',
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

export function getUserLists(filter): Promise<UserListResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<UserListResponseModel>(
        {
          url: API_URL + '/api/user/userList',
          method: 'POST',
          params: { filter },
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

export function fido2GetRegOptions(): Promise<fido2RegOptionsResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<fido2RegOptionsResponseModel>(
        {
          url: API_URL + '/api/user/fido2/request',
          method: 'POST',
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

export function fido2Register(params): Promise<fido2RegOptionsResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<fido2RegOptionsResponseModel>(
        {
          url: API_URL + '/api/user/fido2/register',
          method: 'POST',
          params,
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

export function fido2GetLoginOptions(username): Promise<fido2LoginOptionsResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<fido2LoginOptionsResponseModel>(
        {
          url: API_URL + `/api/user/fido2/login?username=${username}`,
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

export function fido2Login(params): Promise<fido2LoginOptionsResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<fido2LoginOptionsResponseModel>(
        {
          url: API_URL + '/api/user/fido2/login',
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

export function fido2GetCredentials(): Promise<SessionsResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<SessionsResponseModel>(
        {
          url: API_URL + '/api/user/fido2/credentials',
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

export function fido2DeleteCredential(id): Promise<SessionsResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<SessionsResponseModel>(
        {
          url: API_URL + '/api/user/fido2/delete',
          method: 'POSt',
          params: { id },
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
