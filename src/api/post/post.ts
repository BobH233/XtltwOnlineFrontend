import { http } from '@/utils/http/axios';
import { MapMessage } from '../messageMap';
import { RespHook } from '../respHook';

const API_URL = import.meta.env.VITE_BOBH_API_URL;

export interface UserPostsResponseModel<T = any> {
  code: number;
  message: string;
  page: number;
  data: T[];
}

export interface getPostsParams {
  page: number; //第几页数据
  PerPage: number; //每一页多少数据
  filter: string; //过滤要查询的数据JSON数据
}

export interface NewPostResponseModel {
  code: number;
  message: string;
  postId: string;
}

export interface DeletePostResponseModel {
  code: number;
  message: string;
}

export interface TimelineItem {
  status: string;
  UpdateTime: string;
  _id: string;
}

export interface CommentItem {
  _id: string;
  PostId: string;
  OwnerId: string;
  CommentContent: string;
  CommentDate: string;
}

export interface PostDetailResponseModel {
  code: number;
  message: string;
  post_data: {
    _id: string;
    OwnerId: string;
    Title: string;
    FDYInCharge: string;
    TwMemberInCharge: string;
    PostStatus: string;
    TimeLine: TimelineItem[] | any;
    XiumiSessionId: string;
    XiumiPaperInfo: string;
    TZBForwardPaperInfo: string;
    TZBForwardPaperAccountId: string;
    pubaccPaperId: string;
    TWArrangeForwardPaperInfo: string;
    TWArrangeForwardSessionId: string;
    TWForwardPaperInfo: string;
    SendingDate: string;
  };
  comment_data: CommentItem[];
}

export interface SendCommentResponseModel {
  code: number;
  message: string;
}
export interface requireRecheckResponseModel {
  code: number;
  message: string;
}

export interface PassTWResponseModel {
  code: number;
  message: string;
  data: any;
}

export interface confirmTZBResponseModel {
  code: number;
  message: string;
  data: {
    success: boolean;
    errorMsg: string;
  };
}

export function getPosts(
  userPermission: string,
  params: getPostsParams
): Promise<UserPostsResponseModel> {
  const apiUrl = {
    FDY: API_URL + '/api/post/fdy/getPosts',
    TZB: API_URL + '/api/post/tzb/getPosts',
    TwAdmin: API_URL + '/api/post/twadmin/getPosts',
    TwMember: API_URL + '/api/post/tw/getPosts',
  };
  if (!apiUrl.hasOwnProperty(userPermission)) {
    return Promise.resolve({
      code: 401,
      message: 'Invalid Permission string!',
      map_string: '非法的权限请求，联系管理员',
      page: 0,
      data: [],
    });
  }
  return new Promise((resolve, reject) => {
    http
      .request<UserPostsResponseModel>(
        {
          url: apiUrl[userPermission],
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

export function sendComment(
  userPermission: string,
  params: any
): Promise<SendCommentResponseModel> {
  const apiUrl = {
    FDY: API_URL + '/api/post/fdy/comment',
    TZB: API_URL + '/api/post/tzb/comment',
    TwAdmin: API_URL + '/api/post/tw/comment',
    TwMember: API_URL + '/api/post/tw/comment',
  };
  if (!apiUrl.hasOwnProperty(userPermission)) {
    return Promise.resolve({
      code: 401,
      message: 'Invalid Permission string!',
      map_string: '非法的权限请求，联系管理员',
      page: 0,
      data: [],
    });
  }
  return new Promise((resolve, reject) => {
    http
      .request<SendCommentResponseModel>(
        {
          url: apiUrl[userPermission],
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

export function requireRevise(params: any): Promise<SendCommentResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<SendCommentResponseModel>(
        {
          url: API_URL + '/api/post/fdy/requireRevise',
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

export function sendNewPost(params): Promise<NewPostResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<NewPostResponseModel>(
        {
          url: API_URL + '/api/post/tzb/newPost',
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

export function deletePost(params): Promise<DeletePostResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<DeletePostResponseModel>(
        {
          url: API_URL + '/api/post/tzb/deletePost',
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

export function getPostDetail(postId): Promise<PostDetailResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<PostDetailResponseModel>(
        {
          url: API_URL + `/api/post/details/${postId}`,
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

export function requireRecheck(params: any): Promise<requireRecheckResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<requireRecheckResponseModel>(
        {
          url: API_URL + '/api/post/tzb/requireRecheck',
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

export function passPostFDY(postId): Promise<requireRecheckResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<requireRecheckResponseModel>(
        {
          url: API_URL + '/api/post/fdy/pass',
          method: 'POST',
          params: { postId },
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

export function passPostTW(params): Promise<PassTWResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<PassTWResponseModel>(
        {
          url: API_URL + '/api/post/tw/pass',
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

export function confirmTZB(params: any): Promise<confirmTZBResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<confirmTZBResponseModel>(
        {
          url: API_URL + '/api/post/tzb/confirm',
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
