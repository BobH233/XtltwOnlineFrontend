/*
  文章列表路由
*/
import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { UnorderedListOutlined } from '@vicons/antd';
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
    path: '/post',
    name: 'PostList',
    component: Layout,
    meta: {
      title: '文章',
      icon: renderIcon(UnorderedListOutlined),
      permissions: ['FDY', 'TwAdmin', 'TZB', 'TwMember'],
    },
    children: [
      {
        path: 'list',
        name: 'post_list',
        meta: {
          title: '申请列表',
          icon: renderIcon(UnorderedListOutlined),
          permissions: ['FDY', 'TwAdmin', 'TZB', 'TwMember'],
          keepAlive: true,
        },
        component: () => import('@/views/post/list/list.vue'),
      },
      {
        path: 'detail/:id?',
        name: 'post_detail',
        meta: {
          title: '申请详情',
          hidden: true,
          keepAlive: true,
        },
        component: () => import('@/views/post/detail/detail.vue'),
      },
    ],
  },
];

export default routes;
