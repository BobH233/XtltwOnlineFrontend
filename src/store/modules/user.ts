/* eslint-disable @typescript-eslint/no-this-alias */
import { defineStore } from 'pinia';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER, IS_LOCKSCREEN } from '@/store/mutation-types';
import { ResultEnum } from '@/enums/httpEnum';

import { login, logout, getUserInfo } from '@/api/user/user';
import { storage } from '@/utils/Storage';

export interface IUserState {
  token: string;
  username: string;
  welcome: string;
  avatar: string;
  permissions: any[];
  info: any;
  Role: string;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: storage.get(CURRENT_USER, {}),
    Role: '',
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getNickname(): string {
      return this.username;
    },
    getPermissions(): [any][] {
      return this.permissions;
    },
    getUserInfo(): object {
      return this.info;
    },
    getRole(): string {
      return this.Role;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
      if (Array.isArray(permissions) && permissions.length >= 1) {
        this.Role = permissions[0].value;
      }
    },
    setUserInfo(info) {
      this.info = info;
    },
    async fido2Logined(user) {
      try {
        const ex = 24 * 60 * 60;
        storage.set(ACCESS_TOKEN, user._id, ex); // 因为有cookie校验，所以这里直接拿用户id了
        storage.set(CURRENT_USER, user, ex);
        storage.set(IS_LOCKSCREEN, false);
        this.setToken(user._id);
        this.setUserInfo(user);
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    },
    // 登录
    async login(userInfo) {
      try {
        const response = await login(userInfo);
        const { user, code } = response;
        if (code === ResultEnum.SUCCESS) {
          let ex = 30 * 24 * 60 * 60;
          if (!userInfo.remember) ex = 24 * 60 * 60;
          storage.set(ACCESS_TOKEN, user._id, ex); // 因为有cookie校验，所以这里直接拿用户id了
          storage.set(CURRENT_USER, user, ex);
          storage.set(IS_LOCKSCREEN, false);
          this.setToken(user._id);
          this.setUserInfo(user);
        }
        return Promise.resolve(response);
      } catch (e) {
        return Promise.reject(e);
      }
    },

    // 获取用户信息
    GetInfo() {
      const that = this;
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res) => {
            if (res.code !== 200) {
              resolve(res);
              return;
            }
            const result = res;
            const permissionList = [
              {
                value: result.user.role,
                lable: '账户权限',
              },
            ];
            result.user.permissions = permissionList;
            that.setUserInfo(result.user);
            that.setPermissions(permissionList);
            that.setAvatar('');
            resolve(result.user);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 登出
    async logout() {
      this.setPermissions([]);
      this.setUserInfo('');
      storage.remove(ACCESS_TOKEN);
      storage.remove(CURRENT_USER);
      const response = await logout();
      return Promise.resolve(response);
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWidthOut() {
  return useUserStore(store);
}
