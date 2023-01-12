import { h } from 'vue';
import { NTag } from 'naive-ui';
import { SmileFilled, UserOutlined, ExclamationCircleFilled } from '@vicons/antd';
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
    title: '用户名',
    key: 'XiumiUsername',
    render(row) {
      return h(
        NTag,
        {
          type: 'success',
        },
        {
          default: row.username,
          icon: renderIcon(UserOutlined),
        }
      );
    },
  },
  {
    title: '描述',
    key: 'description',
  },
  {
    title: '满存状态',
    key: 'LastIsFull',
    render(row) {
      const capText = `(${row.curPaperCnt}/${row.maxPaperCnt})`;
      return h(
        NTag,
        {
          type: row.LastIsFull ? 'error' : 'success',
        },
        {
          default: row.LastIsFull ? '已满' + capText : '空闲' + capText,
          icon: row.LastIsFull ? renderIcon(ExclamationCircleFilled) : renderIcon(SmileFilled),
        }
      );
    },
  },
  {
    title: '最后转存日期',
    key: 'LastSaveDate',
    render(row) {
      const lastDate = new Date(parseInt(row.LastSaveDate));
      return dateFormat('YYYY-mm-dd HH:MM:SS', lastDate);
    },
  },
];
