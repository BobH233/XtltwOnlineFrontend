/*
  账号安全方面的路由
*/
import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { BugFilled } from '@vicons/antd';
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
    path: '/bugreport',
    name: 'bugreport',
    component: Layout,
    meta: {
      title: '漏洞反馈',
      icon: renderIcon(BugFilled),
      permissions: ['FDY', 'TwAdmin', 'TZB', 'TwMember'],
      sort: 10,
    },
    children: [
      {
        path: '',
        name: 'bugreport_main',
        meta: {
          title: '漏洞反馈',
          icon: renderIcon(BugFilled),
          permissions: ['FDY', 'TwAdmin', 'TZB', 'TwMember'],
        },
        component: () => import('@/views/bugreport/bugreport.vue'),
      },
    ],
  },
];

export default routes;
