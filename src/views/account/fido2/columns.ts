import { h } from 'vue';
import { NTag } from 'naive-ui';
import { CompassOutlined, MacCommandFilled, GlobalOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils';

export const columns = [
  {
    title: 'id',
    key: '_id',
  },
  {
    title: '标签',
    key: 'Label',
  },
  {
    title: '计数器',
    key: 'Counter',
  },
];
