import { h } from 'vue';
import { NTag } from 'naive-ui';
import { UserOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils';

export const columns = [
  {
    title: '用户名',
    key: 'username',
  },
  {
    title: '昵称',
    key: 'nickname',
  },
  {
    title: '身份',
    key: 'role',
    render(row) {
      const roleCn = {
        FDY: '辅导员',
        TwAdmin: '团委管理员',
        TwMember: '团委干事',
        TZB: '团支部',
      };
      return h(
        NTag,
        {
          type: 'success',
        },
        {
          default: roleCn[row.role],
          icon: renderIcon(UserOutlined),
        }
      );
    },
  },
  {
    title: '最后活动时间',
    key: 'lastActiveTime',
    render(row) {
      if (!row.lastActiveTime) return `未知`;
      const SendDate = new Date(parseInt(row.lastActiveTime));
      const nowDate = new Date();
      if (SendDate.getFullYear() == nowDate.getFullYear()) {
        return `${
          SendDate.getMonth() + 1
        }月${SendDate.getDate()}日 ${SendDate.getHours()}:${SendDate.getMinutes()}`;
      } else {
        return `${SendDate.getFullYear()}年${
          SendDate.getMonth() + 1
        }月${SendDate.getDate()}日 ${SendDate.getHours()}:${SendDate.getMinutes()}`;
      }
    },
  },
];
