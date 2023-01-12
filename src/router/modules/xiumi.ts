/*
  秀米会话管理路由
*/
import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { WechatFilled } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

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
    path: '/xiumi',
    name: 'XiumiSession',
    component: Layout,
    meta: {
      title: '秀米',
      icon: renderIcon(WechatFilled),
      permissions: ['TwAdmin', 'TZB', 'TwMember'],
      sort: 7,
    },
    children: [
      {
        path: 'list',
        name: 'xiumi_session_list',
        meta: {
          title: '秀米账号绑定',
          icon: renderIcon(WechatFilled),
          permissions: ['TwAdmin', 'TZB', 'TwMember'],
          keepAlive: true,
        },
        component: () => import('@/views/xiumi/session_list/session_list.vue'),
      },
      {
        path: 'session/new/:time',
        name: 'xiumi_session_new',
        meta: {
          title: '绑定新秀米账号',
          permissions: ['TwAdmin', 'TZB', 'TwMember'],
          hidden: true,
        },
        component: () => import('@/views/xiumi/new_session/new_session.vue'),
      },
    ],
  },
];

export default routes;
