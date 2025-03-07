import { http } from '@/utils/http/axios';
import { MapMessage } from '../messageMap';
import { RespHook } from '../respHook';

const API_URL = import.meta.env.VITE_BOBH_API_URL;

export interface XiumiSessionsResponseModel<T = any> {
  code: number;
  message: string;
  data: T[];
}

export interface XiumiCaptchaResponseModel {
  code: number;
  needCaptcha: boolean;
  svgData: string;
}

export interface XiumiLoginResponseModel {
  code: number;
  message: string;
  detail: {
    success: boolean;
    Cookie: string;
    ori_cookie: string;
    is_wrong_captcha: boolean;
    is_wrong_account: boolean;
  };
  XiumiSession: {
    cookie: string;
    validSession: boolean;
    lastUpdateTime: string;
    XiumiUsername: string;
    UserID: string;
    UserInfo: string;
    _id: string;
  };
}

export interface XiumiRencentPapaerResponseModel<T = any> {
  code: number;
  message: string;
  data: T[];
}

export interface XiumiSafeDeleteSendedPaperResponseModel {
  code: number;
  message: string;
  data: {
    deleteCount: number;
    successCount: number;
    deletedPaper: string[];
  };
}

export function getValidXiumiSessions(): Promise<XiumiSessionsResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<XiumiSessionsResponseModel>(
        {
          url: API_URL + '/api/xiumi/getValidSessions',
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

export function checkCaptcha(username): Promise<XiumiCaptchaResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<XiumiCaptchaResponseModel>(
        {
          url: API_URL + `/api/xiumi/checkCaptcha?username=${username}`,
          method: 'GET',
        },
        {
          isTransformResponse: false,
        }
      )
      .then((resp) => {
        RespHook(resp, () => {
          resolve(resp);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function getNewCaptcha(): Promise<XiumiCaptchaResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<XiumiCaptchaResponseModel>(
        {
          url: API_URL + '/api/xiumi/newCaptcha',
          method: 'GET',
        },
        {
          isTransformResponse: false,
        }
      )
      .then((resp) => {
        RespHook(resp, () => {
          resolve(resp);
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function xiumiSessionLogin(params: any): Promise<XiumiLoginResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<XiumiLoginResponseModel>(
        {
          url: API_URL + '/api/xiumi/xiumiLogin',
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

export function getRecentPaper(params): Promise<XiumiRencentPapaerResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<XiumiRencentPapaerResponseModel>(
        {
          url: API_URL + '/api/xiumi/getRecentPaper',
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

export function getOtherUserSessions(userId): Promise<XiumiRencentPapaerResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<XiumiRencentPapaerResponseModel>(
        {
          url: API_URL + '/api/xiumi/getUserSessions',
          method: 'POST',
          params: { userId },
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

export function safeDeleteSended(sessionId): Promise<XiumiSafeDeleteSendedPaperResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<XiumiSafeDeleteSendedPaperResponseModel>(
        {
          url: API_URL + '/api/xiumi/safeDeleteSended',
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
