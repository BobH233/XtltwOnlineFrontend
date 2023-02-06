import type { Plugin,PluginOption } from 'vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

import { configHtmlPlugin } from './html';
import { configMockPlugin } from './mock';
import { configCompressPlugin } from './compress';
import { VitePWA } from 'vite-plugin-pwa';

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean, prodMock) {
  const { VITE_USE_MOCK, VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE } = viteEnv;

  const vitePlugins: (Plugin | Plugin[] | PluginOption[])[] = [
    // have to
    vue(),
    // have to
    vueJsx(),

    // 按需引入NaiveUi且自动创建组件声明
    Components({
      dts: true,
      resolvers: [NaiveUiResolver()],
    }),
    VitePWA({
      manifest: {
        name: '团委在线审核平台',
        short_name: '团委在线审核平台',
        description: '徐特立团委在线审核平台',
        theme_color: '#2d8cf0',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        shortcuts: [
          {
            short_name: '审核列表',
            url: '#/post/list',
            name: '审核列表',
            icons: [],
          },
        ],
        icons: [
          {
            src: '/512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/512x512.png',
            sizes: '60x60',
            type: 'image/png',
          },
          {
            src: '/512x512.png',
            sizes: '192x192',
            type: 'image/png',
          },
        ],
      },
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
    }),
  ];

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));

  // vite-plugin-mock
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild, prodMock));

  if (isBuild) {
    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE)
    );
  }

  return vitePlugins;
}
