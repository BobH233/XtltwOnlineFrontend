// 对于服务端返回的数据进行hook操作，假如发现错误的信息，则对用户进行登出

import { useUserStore } from '@/store/modules/user';
import { TABS_ROUTES } from '@/store/mutation-types';

let userStore;
let message;
let router;
let route;

function DoLogout() {
  if (router == undefined) {
    userStore = useUserStore();
    message = window['$message'];
    router = window['$router'];
    route = window['$route'];
  }
  userStore.logout().then(() => {
    message.error('身份信息失效!');
    // 移除标签页
    localStorage.removeItem(TABS_ROUTES);
    router
      .replace({
        name: 'Login',
        query: {
          redirect: route.fullPath,
        },
      })
      .finally(() => location.reload());
  });
}

export function RespHook(resp, next) {
  if (
    resp.code == 401 &&
    (resp.message == 'Expired session token or invalid session' ||
      resp.message == 'Unauthorized token')
  ) {
    setTimeout(DoLogout, 1000);
    next();
  } else {
    next();
  }
}
