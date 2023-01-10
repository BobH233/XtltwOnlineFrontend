// 解决quill的图片上传问题

import { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';
import { uploadImage } from '@/api/upload/upload';
import * as CryptoJS from 'crypto-js';

export function UploadFileData(form: FormData): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    uploadImage(form)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function GetFileHash(file: File): Promise<string> {
  return new Promise<string>((resolve, _reject) => {
    const reader = new FileReader();
    reader.onload = (fuckyou: any) => {
      const hash = CryptoJS.SHA1(fuckyou.target.result).toString();
      resolve(hash);
    };
    reader.readAsDataURL(file);
  });
}
const hash2UrlMap = {};
export function BindQuillUploadImageInterface(message: MessageApiInjection, quillEditorRef: any) {
  const quill = quillEditorRef.value.getQuill();
  quill.root.addEventListener('paste', (evt) => {
    if (evt.clipboardData && evt.clipboardData.files && evt.clipboardData.files.length) {
      evt.preventDefault();
      [].forEach.call(evt.clipboardData.files, (file: File) => {
        if (!file.type.match(/^image\/(gif|jpe?g|a?png|bmp)/i)) {
          message.error('只能上传图片文件!');
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          message.error('图片大小不能超过10MB!');
          return;
        }
        GetFileHash(file).then((hash) => {
          if (hash2UrlMap[hash] !== undefined) {
            console.log('hit cache');
            const length = quill.getSelection().index; //光标位置
            quill.insertEmbed(length, 'image', hash2UrlMap[hash]);
            quill.setSelection(length + 1);
          } else {
            message.info('请稍等，正在上传图片...');
            const formData = new FormData();
            formData.append('uploadImg', file);
            UploadFileData(formData)
              .then((res) => {
                if (res.code == 200) {
                  const length = quill.getSelection().index; //光标位置
                  quill.insertEmbed(length, 'image', res.url);
                  hash2UrlMap[hash] = res.url;
                  quill.setSelection(length + 1);
                  message.success('上传成功！');
                } else {
                  message.error('上传图片失败: ' + res.message);
                }
              })
              .catch((err) => {
                console.error(err);
              });
          }
        });
      });
    }
  });
}
