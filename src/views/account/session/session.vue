<template>
  <n-card :bordered="false" title="会话管理">
    在这里看到你登陆的其他设备，IP地址，并进行操作。
  </n-card>
  <n-card :bordered="false" class="mt-4 proCard">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
    >
      <template #tableTitle>
        <n-button type="error" @click="doDeleteAllSession">
          <template #icon>
            <n-icon>
              <DeleteOutlined />
            </n-icon>
          </template>
          下线所有会话
        </n-button>
      </template>
      <template #action>
        <TableAction />
      </template>
    </BasicTable>
  </n-card>
</template>

<script lang="ts" setup>
  import { getMySessions, deleteMySession, deleteAllMySession } from '@/api/user/user';
  import { reactive, h, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { columns } from './columns';
  import { useDialog, useMessage } from 'naive-ui';
  import { DeleteOutlined } from '@vicons/antd';

  const dialog = useDialog();
  const message = useMessage();
  const actionRef = ref<any>();
  const loadDataTable = async (res: any) => {
    // 载入表格数据的函数，res表示页数和每页个数
    try {
      let rawTableData = await getMySessions();
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
  function doDeleteAllSession() {
    dialog.warning({
      title: '下线所有会话',
      content: '你确定要下线所有会话吗？你的当前登录也会被下线',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        deleteAllMySession().then((res) => {
          if (res.code == 200) {
            message.success(res['map_message']);
            location.reload();
          } else {
            message.error(res['map_message']);
          }
        });
      },
      onNegativeClick: () => {},
    });
  }
  const actionColumn = reactive({
    width: 250,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction, {
        style: 'button',
        actions: [
          {
            label: '下线',
            onClick: () => {
              deleteMySession(record._id).then((res) => {
                if (res.code == 200) {
                  message.success('成功下线');
                  actionRef.value.reload();
                } else {
                  message.error(res['map_message']);
                }
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
</script>
