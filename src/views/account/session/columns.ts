import { h } from 'vue';
import { NTag } from 'naive-ui';
import { CompassOutlined, MacCommandFilled, GlobalOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils';

export const columns = [
  {
    title: '浏览器',
    key: 'userAgent_browser',
    render(row) {
      const uaObj = JSON.parse(row.userAgent);
      return h(
        NTag,
        {
          type: 'info',
        },
        {
          default: uaObj.browser,
          icon: renderIcon(CompassOutlined),
        }
      );
    },
  },
  {
    title: '操作系统',
    key: 'userAgent_os',
    render(row) {
      const uaObj = JSON.parse(row.userAgent);
      return h(
        NTag,
        {
          type: 'info',
        },
        {
          default: `${uaObj.platform}/${uaObj.os}`,
          icon: renderIcon(MacCommandFilled),
        }
      );
    },
  },
  {
    title: 'IP',
    key: 'ipinfo',
    render(row) {
      const ipObj = JSON.parse(row.IP);
      return h(
        NTag,
        {
          type: 'success',
        },
        {
          default: ipObj.ip,
          icon: renderIcon(GlobalOutlined),
        }
      );
    },
  },
];
