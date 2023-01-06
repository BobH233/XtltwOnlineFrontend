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
