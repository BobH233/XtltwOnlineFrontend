<template>
  <div>
    <n-card :bordered="false" title="秀米账号绑定">
      在下面登录你的秀米账号以绑定秀米账号，然后进行转存相关操作时即可使用这个账号。<br />
      注意，由于网络问题，你的秀米账号绑定可能会失效，导致消失在列表中，注意在转存前留意一下是否失效。
    </n-card>
    <n-card :bordered="false" class="mt-4 proCard">
      <BasicTable
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
      >
        <template #tableTitle>
          <n-button type="primary" @click="NewXiumiLogin">
            <template #icon>
              <n-icon>
                <PlusCircleOutlined />
              </n-icon>
            </template>
            新建绑定
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
  import { getValidXiumiSessions } from '@/api/xiumi/xiumi';
  import { ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { columns } from './columns';
  import { useDialog } from 'naive-ui';
  import { PlusCircleOutlined } from '@vicons/antd';
  import { useRouter } from 'vue-router';

  const dialog = useDialog();
  const actionRef = ref<any>();
  const router = useRouter();
  const loadDataTable = async (_res: any) => {
    // 载入表格数据的函数，res表示页数和每页个数
    try {
      let rawTableData = await getValidXiumiSessions();
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
  function NewXiumiLogin() {
    router.push({ name: 'xiumi_session_new', params: { time: Date.now() } });
  }
</script>
