import { h } from 'vue';
import { NTag } from 'naive-ui';
import {
  CheckCircleFilled,
  FrownFilled,
  MehFilled,
  SmileFilled,
  SecurityScanFilled,
  TeamOutlined,
  MailFilled,
} from '@vicons/antd';
import { renderIcon } from '@/utils';

const PostStatusMap = {
  FDYCheck: {
    type: 'warning',
    icon: renderIcon(MehFilled),
    tips: '待辅导员审核',
  },
  ToRevise: {
    type: 'error',
    icon: renderIcon(FrownFilled),
    tips: '待修改',
  },
  FDYPass: {
    type: 'success',
    icon: renderIcon(SmileFilled),
    tips: '辅导员审核通过',
  },
  TWToCheck: {
    type: 'warning',
    icon: renderIcon(TeamOutlined),
    tips: '待团委审核',
  },
  TWChecking: {
    type: 'warning',
    icon: renderIcon(SecurityScanFilled),
    tips: '团委正审核',
  },
  Sending: {
    type: 'success',
    icon: renderIcon(MailFilled),
    tips: '待新媒发送',
  },
  Sended: {
    type: 'info',
    icon: renderIcon(CheckCircleFilled),
    tips: '已发出',
  },
};

export const columns = [
  {
    title: '标题',
    key: 'Title',
  },
  {
    title: '发布者',
    key: 'OwnerId',
    render(row) {
      return row.ownerInfo.nickname;
    },
  },
  {
    title: '申请状态',
    key: 'PostStatus',
    render(row) {
      return h(
        NTag,
        {
          type: PostStatusMap[row.PostStatus].type,
        },
        {
          default: PostStatusMap[row.PostStatus].tips,
          icon: PostStatusMap[row.PostStatus].icon,
        }
      );
    }
  },
  {
    title: '发出日期',
    key: 'SendingDate',
    render(row) {
      const SendDate = new Date(parseInt(row.SendingDate));
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
