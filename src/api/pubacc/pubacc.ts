import { http } from '@/utils/http/axios';
import { MapMessage } from '../messageMap';
import { RespHook } from '../respHook';

const API_URL = import.meta.env.VITE_BOBH_API_URL;

export interface PubaccListResponseModel<T = any> {
  code: number;
  message: string;
  data: T[];
}

export interface DeletePubaccResponseModel {
  code: number;
  message: string;
}

export interface AddPubaccResponseModel {
  code: number;
  message: string;
}

export function getPubaccs(): Promise<PubaccListResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<PubaccListResponseModel>(
        {
          url: API_URL + '/api/pubacc/get',
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

export function deletePubaccs(id): Promise<DeletePubaccResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<DeletePubaccResponseModel>(
        {
          url: API_URL + '/api/pubacc/remove',
          method: 'POST',
          params: { pubaccId: id },
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

export function addPubaccs(params): Promise<AddPubaccResponseModel> {
  return new Promise((resolve, reject) => {
    http
      .request<AddPubaccResponseModel>(
        {
          url: API_URL + '/api/pubacc/add',
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
