<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="公用和账号列表">
        请确保添加多个有效的账号以保证团支部转存时，一定能够有一个账号成功 <br />
        另外请确保这些公用的转存账号均已经在<router-link :to="{ path: '/xiumi/list' }"
          >秀米账号绑定</router-link
        >中完成了绑定！
      </n-card>
    </div>
    <n-card :bordered="false" class="mt-4 proCard">
      <BasicTable
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
      >
        <template #tableTitle>
          <n-button type="primary" @click="NewPubacc">
            <template #icon>
              <n-icon>
                <PlusCircleOutlined />
              </n-icon>
            </template>
            新建公用账号
          </n-button>
        </template>
        <template #action>
          <TableAction />
        </template>
      </BasicTable>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { getPubaccs, deletePubaccs } from '@/api/pubacc/pubacc';

  import { useDialog, useMessage } from 'naive-ui';
  import { reactive, h, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { columns } from './columns';
  import { useRouter } from 'vue-router';
  import { PlusCircleOutlined } from '@vicons/antd';
  import { safeDeleteSended } from '@/api/xiumi/xiumi';

  const dialog = useDialog();
  const message = useMessage();
  const router = useRouter();
  const actionRef = ref<any>();

  const loadDataTable = async (_res: any) => {
    // 载入表格数据的函数，res表示页数和每页个数
    try {
      let rawTableData = await getPubaccs();
      return {
        page: 1,
        pageSize: rawTableData.data.length,
        pageCount: 1,
        list: rawTableData.data,
        message: 'ok',
        type: 'success',
      };
    } catch (err) {
      dialog.error({
        title: '错误',
        content: '获取列表数据出错，请检查网络或联系管理员',
        positiveText: '确定',
      });
    }
  };

  const actionColumn = reactive({
    width: 200,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction, {
        style: 'button',
        actions: [
          {
            label: '移除',
            onClick: () => {
              dialog.warning({
                title: '确认移除',
                content: '确定要移除这个公用账号吗？',
                positiveText: '确认',
                negativeText: '取消',
                onPositiveClick: () => {
                  deletePubaccs(record._id).then((res) => {
                    if (res.code == 200) {
                      message.success('移除成功');
                      actionRef.value.reload();
                    } else {
                      message.error(res['map_message']);
                    }
                  });
                },
              });
            },
            ifShow: () => {
              return true;
            },
          },
          {
            label: '安全清理',
            onClick: () => {
              dialog.warning({
                title: '确认安全清理',
                content: '系统会将此账号所有已发出的申请对应的转存图文删除，您可以放心删除！',
                positiveText: '确认',
                negativeText: '取消',
                onPositiveClick: () => {
                  message.info('正在清理，请稍等...');
                  safeDeleteSended(record._id).then((res) => {
                    if (res.code == 200) {
                      dialog.success({
                        title: '清理成功',
                        content: `有${res.data.deleteCount}篇推送可删除，成功删除了${res.data.successCount}篇！`,
                        positiveText: '确认',
                      });
                    } else {
                      dialog.error({
                        title: '清理失败',
                        content: res['map_message'],
                        positiveText: '确认',
                      });
                    }
                  });
                },
              });
            },
            ifShow: () => {
              return true;
            },
          },
        ],
      });
    },
  });
  function NewPubacc() {
    router.push({ name: 'pubacc_add', params: { time: Date.now() } });
  }
</script>

<style lang="less" scoped></style>
