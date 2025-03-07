/*
  文章列表路由
*/
import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { HddFilled } from '@vicons/antd';
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
    path: '/pubacc',
    name: 'PublicTwAccount',
    component: Layout,
    meta: {
      title: '公用转存账号',
      icon: renderIcon(HddFilled),
      permissions: ['TwAdmin'],
      sort: 5,
    },
    children: [
      {
        path: 'list',
        name: 'pubacc_list',
        meta: {
          title: '公用转存账号',
          icon: renderIcon(HddFilled),
          permissions: ['TwAdmin'],
          keepAlive: true,
        },
        component: () => import('@/views/pubacc/list/list.vue'),
      },
      {
        path: 'add/:time',
        name: 'pubacc_add',
        meta: {
          title: '添加公用账号',
          hidden: true,
          permissions: ['TwAdmin'],
          keepAlive: true,
        },
        component: () => import('@/views/pubacc/new_pubacc/new_pubacc.vue'),
      },
    ],
  },
];

export default routes;
