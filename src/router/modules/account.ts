/*
  账号安全方面的路由
*/
import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { DatabaseOutlined, LockOutlined, UserOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';
import { FingerPrint } from '@vicons/ionicons5';

/**
 * @param name 路由名称, 必须设置,且不能重名
 * @param meta 路由元信息（路由附带扩展信息）
 * @param redirect 重定向地址, 访问这个路由时,自定进行重定向
 * @param meta.disabled 禁用整个菜单
 * @param meta.title 菜单名称
 * @param meta.icon 菜单图标
 * @param meta.keepAlive 缓存该路由
 * @param meta.sort 排序越小越排前
 *
 * */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/account',
    name: 'accountSetting',
    component: Layout,
    meta: {
      title: '账号安全',
      icon: renderIcon(UserOutlined),
      permissions: ['FDY', 'TwAdmin', 'TZB', 'TwMember'],
      sort: 9,
    },
    children: [
      {
        path: 'password',
        name: 'account_change_password',
        meta: {
          title: '修改密码',
          icon: renderIcon(LockOutlined),
          permissions: ['FDY', 'TwAdmin', 'TZB', 'TwMember'],
        },
        component: () => import('@/views/account/password/password.vue'),
      },
      {
        path: 'session',
        name: 'account_session_manage',
        meta: {
          title: '会话管理',
          icon: renderIcon(DatabaseOutlined),
          permissions: ['FDY', 'TwAdmin', 'TZB', 'TwMember'],
        },
        component: () => import('@/views/account/session/session.vue'),
      },
      {
        path: 'fido2',
        name: 'account_fido2',
        meta: {
          title: '生物验证',
          icon: renderIcon(FingerPrint),
          permissions: ['FDY', 'TwAdmin', 'TZB', 'TwMember'],
        },
        component: () => import('@/views/account/fido2/fido2.vue'),
      },
    ],
  },
];

export default routes;
