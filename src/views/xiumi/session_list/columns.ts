import { h } from 'vue';
import { NTag } from 'naive-ui';
import { StarFilled, UserOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils';

function dateFormat(fmt, date) {
  let ret;
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString(), // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'));
    }
  }
  return fmt;
}

export const columns = [
  {
    title: '秀米用户名',
    key: 'XiumiUsername',
    render(row) {
      return h(
        NTag,
        {
          type: 'success',
        },
        {
          default: row.XiumiUsername,
          icon: renderIcon(UserOutlined),
        }
      );
    },
  },
  {
    title: '秀米昵称',
    key: 'XiumiNickname',
    render(row) {
      const uaObj = JSON.parse(row.UserInfo);
      return uaObj.user.nickname;
    },
  },
  {
    title: '最后有效时间',
    key: 'LastUpdateTime',
    render(row) {
      const lastDate = new Date(parseInt(row.lastUpdateTime));
      return dateFormat('YYYY-mm-dd HH:MM:SS', lastDate);
    },
  },
  {
    title: '状态',
    key: 'Status',
    render(row) {
      return h(
        NTag,
        {
          type: 'success',
        },
        {
          default: '在线',
          icon: renderIcon(StarFilled),
        }
      );
    },
  },
];
