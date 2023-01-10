import { MapMessage } from '../messageMap';
import { RespHook } from '../respHook';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BOBH_API_URL;

export interface UploadImageResponseModel {
  code: number;
  message: string;
  url: string;
  sizeUsed: number;
}

export function uploadImage(formData: FormData): Promise<UploadImageResponseModel> {
  return new Promise((resolve, reject) => {
    axios
      .post(API_URL + '/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        validateStatus: () => {
          return true;
        },
        withCredentials: true,
      })
      .then((resp: any) => {
        resp = resp.data;
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
