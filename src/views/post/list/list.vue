<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="申请列表"> {{ role_descriptions[Role] }} </n-card>
    </div>
    <n-card :bordered="false" class="mt-4 proCard">
      <BasicTable
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
        @update:checked-row-keys="onCheckedRow"
      >
        <template #tableTitle>
          <!--
          <n-button type="primary">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            添加角色
          </n-button>
          -->
          <n-dynamic-tags v-model:value="model.tags" :render-tag="renderTag" />
        </template>

        <template #action>
          <TableAction />
        </template>
      </BasicTable>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store/modules/user';
  import { getPosts } from '@/api/post/post';
  import { getOtherUserInfo } from '@/api/user/user';
  import { useDialog, NDynamicTags, NForm, NTag, FormRules } from 'naive-ui';
  import { reactive, h, ref, unref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { columns, PostStatusMap } from './columns';
  const userStore = useUserStore();
  const Role = userStore.getRole;
  const dialog = useDialog();
  let queryFilter = [
    'FDYCheck',
    'ToRevise',
    'FDYPass',
    'TWToCheck',
    'TWChecking',
    'Sending',
    'Sended',
  ];
  let ChineseTagMap = {};
  let ChineseFilter: string[] = [];
  const actionRef = ref<any>();
  for (let i = 0; i < queryFilter.length; i++) {
    ChineseTagMap[PostStatusMap[queryFilter[i]].tips] = queryFilter[i];
    ChineseFilter.push(PostStatusMap[queryFilter[i]].tips);
  }
  const model = ref({
    tags: ChineseFilter,
  });
  const refreshList = () => {
    console.log(unref(model).tags);
    let curTags = unref(model).tags;
    queryFilter = [];
    for (let i = 0; i < curTags.length; i++) {
      queryFilter.push(ChineseTagMap[curTags[i]]);
    }
    actionRef.value.reload();
  };

  const renderTag = (tag: string, index: number) => {
    return h(
      NTag,
      {
        type: PostStatusMap[ChineseTagMap[tag]].type,
        closable: true,
        onClose: () => {
          model.value.tags.splice(index, 1);
          refreshList();
        },
      },
      {
        default: () => tag,
        icon: PostStatusMap[ChineseTagMap[tag]].icon,
      }
    );
  };

  const role_descriptions = {
    FDY: '辅导员: 查看您负责的所有推送请求并进行搜索、过滤、操作。',
    TwAdmin: '团委管理员: 查看系统中所有的推送并对辅导员已经通过的文章进行操作。',
    TZB: '团支部: 查看你的团支部已经发送的推送申请状态，并进行修改。',
    TwMember: '团委干事: 查看分配给你的推送任务，并进行修改，然后更新状态。',
  };

  const loadDataTable = async (res: any) => {
    // 载入表格数据的函数，res表示页数和每页个数
    try {
      let rawTableData = await getPosts(Role, {
        page: res.page - 1,
        PerPage: res.pageSize,
        filter: JSON.stringify(queryFilter),
      });
      for (let i = 0; i < rawTableData.data.length; i++) {
        const ownerId = rawTableData.data[i].OwnerId;
        let ownerInfo = await getOtherUserInfo(ownerId);
        rawTableData.data[i].ownerInfo = ownerInfo.user;
      }
      return {
        page: res.page,
        pageSize: res.pageSize,
        pageCount: rawTableData.page,
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

  function onCheckedRow(rowKeys: any[]) {
    console.log(rowKeys);
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
            label: '查看申请',
            onClick: () => {
              alert(JSON.stringify(record));
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

<style lang="less" scoped></style>
