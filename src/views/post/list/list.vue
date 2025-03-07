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
          <n-select
            v-model:value="TagValue"
            multiple
            :options="TagOptions"
            @update:value="handleUpdateTags"
            :render-tag="renderTag"
          />
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
  import { getPosts, deletePost, confirmTZB, twSetSended } from '@/api/post/post';
  import { getOtherUserInfo } from '@/api/user/user';
  import { useDialog, NTag, NSelect, useMessage } from 'naive-ui';
  import { reactive, h, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { columns, PostStatusMap } from './columns';
  import { SelectOption } from 'naive-ui/lib';
  import { useRouter } from 'vue-router';

  const userStore = useUserStore();
  const Role = userStore.getRole;
  const dialog = useDialog();
  const message = useMessage();
  const router = useRouter();
  let queryFilter = [
    'FDYCheck',
    'ToRevise',
    'FDYPass',
    'TWToCheck',
    'TWChecking',
    'Sending',
    'Sended',
  ];
  const TagValue = ref(queryFilter);
  const TagOptions: any = [];
  const actionRef = ref<any>();

  for (let i = 0; i < queryFilter.length; i++) {
    TagOptions.push({
      label: PostStatusMap[queryFilter[i]].tips,
      value: queryFilter[i],
    });
  }

  function handleUpdateTags(_value: string[], _option: SelectOption) {
    actionRef.value.reload();
  }

  function renderTag({ option, handleClose }) {
    return h(
      NTag,
      {
        type: PostStatusMap[option.value].type,
        closable: true,
        onMousedown: (e: FocusEvent) => {
          e.preventDefault();
        },
        onClose: (e: MouseEvent) => {
          e.stopPropagation();
          handleClose();
        },
      },
      {
        default: () => option.label,
        icon: PostStatusMap[option.value].icon,
      }
    );
  }
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
        filter: JSON.stringify(TagValue.value),
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
            onClick: handleViewDetail.bind(null, record),
            ifShow: () => {
              return true;
            },
          },
          {
            label: '已发出',
            onClick: () => {
              dialog.warning({
                title: '确认设置为已发送?',
                content: '请确认公众号已经发出后再点击',
                positiveText: '确认',
                negativeText: '取消',
                onPositiveClick: () => {
                  twSetSended(record._id).then((res) => {
                    if (res.code == 200) {
                      message.success('设置申请为"已发出"成功！');
                      actionRef.value.reload();
                    } else {
                      message.error(res['map_message']);
                    }
                  });
                },
              });
            },
            ifShow: () => {
              return (Role == 'TwAdmin' || Role == 'TwMember') && record.PostStatus == 'Sending';
            },
          },
          {
            label: '撤回',
            onClick: () => {
              dialog.warning({
                title: '确认撤回申请',
                content: '你确认要撤回这篇申请吗？撤回操作不可逆转！',
                positiveText: '确认撤回',
                negativeText: '取消',
                onPositiveClick: () => {
                  deletePost({ postId: record._id }).then((res) => {
                    if (res.code == 200) {
                      message.success(res['map_message']);
                      actionRef.value.reload();
                    } else {
                      message.error(res['map_message']);
                    }
                  });
                },
              });
            },
            ifShow: () => {
              return (
                Role == 'TZB' &&
                (record.PostStatus == 'FDYCheck' ||
                  record.PostStatus == 'ToRevise' ||
                  record.PostStatus == 'FDYPass')
              );
            },
          },
          {
            label: '转存',
            onClick: () => {
              dialog.warning({
                title: '确认转存',
                content: '你确认要转存这篇推送吗，转存后将无法撤回',
                positiveText: '确认',
                negativeText: '取消',
                onPositiveClick: () => {
                  message.info('请稍等，正在转存...');
                  confirmTZB({
                    postId: record._id,
                  }).then((res) => {
                    if (res.code == 200) {
                      dialog.success({
                        title: '转存成功',
                        content: '接下来，请静静等待你的推送被发送',
                        positiveText: '确定',
                        onPositiveClick: () => {
                          location.reload();
                        },
                      });
                    } else if (res.code == 417) {
                      dialog.error({
                        title: '转存失败',
                        content: res['map_message'],
                        positiveText: '确定',
                        onPositiveClick: () => {
                          router.push({ name: 'post_confirm', params: { id: record._id }});
                        },
                      });
                    } else {
                      message.error(res['map_message']);
                    }
                  });
                },
              });
            },
            ifShow: () => {
              return Role == 'TZB' && record.PostStatus == 'FDYPass';
            },
          },
        ],
      });
    },
  });

  function handleViewDetail(record: Recordable) {
    router.push({ name: 'detail', params: { id: record._id } });
  }
</script>

<style lang="less" scoped></style>
