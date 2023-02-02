<template>
  <div>
    <div class="n-layout-page-header">
      <n-card :bordered="false" title="用户管理">新增用户，或者修改密码</n-card>
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
        <template #toolbar>
          <n-button type="primary" @click="showAddUserModal">添加用户</n-button>
        </template>
      </BasicTable>
    </n-card>
    <n-modal v-model:show="showModalChangePassword">
      <n-card
        style="width: 600px"
        title="强制修改密码"
        :bordered="true"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-form :label-width="120" label-placement="left" ref="formRef" class="py-8">
          <n-form-item label="新密码" path="newPass">
            <n-input
              showPasswordOn="click"
              type="password"
              v-model:value="newPassword"
              placeholder="输入新的密码"
            />
          </n-form-item>
          <n-form-item label="确认新密码" path="newPassnConfirm">
            <n-input v-model:value="newPasswordConfirm" placeholder="确认输入新的密码" />
          </n-form-item>
          <n-space justify="center">
            <n-button type="primary" @click="doChangePassword">确认修改</n-button>
          </n-space>
        </n-form>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showModalNewUser">
      <n-card
        style="width: 600px"
        title="添加新用户"
        :bordered="true"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-form :label-width="120" label-placement="left" ref="formRef" class="py-8">
          <n-form-item label="登录用户名" path="newUsername">
            <n-input v-model:value="newUserName" placeholder="输入新的用户名" />
          </n-form-item>
          <n-form-item label="显示昵称" path="newNickname">
            <n-input v-model:value="newNickName" placeholder="输入显示昵称" />
          </n-form-item>
          <n-form-item label="新密码" path="newPass">
            <n-input
              showPasswordOn="click"
              type="password"
              v-model:value="newPassword"
              placeholder="输入新的密码"
            />
          </n-form-item>
          <n-form-item label="确认新密码" path="newPassnConfirm">
            <n-input v-model:value="newPasswordConfirm" placeholder="确认输入新的密码" />
          </n-form-item>
          <n-form-item label="身份" path="role">
            <n-select
              v-model:value="newUserRole"
              :options="newUserOption"
              placeholder="选择身份"
              filterable
            />
          </n-form-item>
          <n-space justify="center">
            <n-button type="primary" @click="doAddNewUser">添加</n-button>
          </n-space>
        </n-form>
      </n-card>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
  import { useUserStore } from '@/store/modules/user';
  import { changeUserPassword, createUser, getUserLists } from '@/api/user/user';
  import { useDialog, NTag, NSelect } from 'naive-ui';
  import { reactive, h, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { columns } from './columns';
  import { SelectOption } from 'naive-ui/lib';
  import { renderIcon } from '@/utils';
  import { UserOutlined } from '@vicons/antd';
  const showModalChangePassword = ref(false);
  const curChangePasswordUserName = ref('');
  const newPassword = ref('');
  const newPasswordConfirm = ref('');

  const showModalNewUser = ref(false);
  const newUserName = ref('');
  const newUserOption = [
    {
      label: '辅导员',
      value: 'FDY',
    },
    {
      label: '团支部',
      value: 'TZB',
    },
    {
      label: '团委干事',
      value: 'TwMember',
    },
  ];
  const newUserRole = ref('');
  const newNickName = ref('');

  const dialog = useDialog();
  let queryFilter = ['FDY', 'TwAdmin', 'TwMember', 'TZB'];
  let queryFilterCn = ['辅导员', '团委管理员', '团委干事', '团支部'];
  const TagValue = ref(queryFilter);
  const TagOptions: any = [];
  const actionRef = ref<any>();
  const  userStore = useUserStore();
  for (let i = 0; i < queryFilter.length; i++) {
    TagOptions.push({
      label: queryFilterCn[i],
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
        type: 'success',
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
        icon: renderIcon(UserOutlined),
      }
    );
  }

  const loadDataTable = async (res: any) => {
    // 载入表格数据的函数，res表示页数和每页个数
    try {
      let rawTableData = await getUserLists(JSON.stringify(TagValue.value));
      let retData: any = [];
      for (let i = 0; i < res.pageSize; i++) {
        const ind = (res.page - 1) * res.pageSize + i;
        if (ind >= rawTableData.data.length) break;
        retData.push(rawTableData.data[ind]);
      }
      return {
        page: res.page,
        pageSize: res.pageSize,
        pageCount: Math.ceil((1.0 * rawTableData.data.length) / res.pageSize),
        list: retData,
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
            label: '强制修改密码',
            onClick: () => {
              curChangePasswordUserName.value = record.username;
              newPassword.value = '';
              newPasswordConfirm.value = '';
              console.log(record);
              showModalChangePassword.value = true;
            },
            ifShow: () => {
              if (record.role == 'TwAdmin' || record.role == 'WebAdmin') return false;
              return true;
            },
          },
        ],
      });
    },
  });
  function showAddUserModal() {
    newPassword.value = '';
    newPasswordConfirm.value = '';
    newNickName.value = '';
    newUserRole.value = '';
    newUserName.value = '';
    showModalNewUser.value = true;
  }
  function doAddNewUser() {
    showModalNewUser.value = false;
    if (newPassword.value != newPasswordConfirm.value) {
      dialog.error({
        title: '两次密码不一致',
        positiveText: '确认',
      });
      return;
    }
    if (!newPassword.value) {
      dialog.error({
        title: '密码不能为空',
        positiveText: '确认',
      });
      return;
    }
    if (!newNickName.value) {
      dialog.error({
        title: '昵称不能为空',
        positiveText: '确认',
      });
      return;
    }
    if (!newNickName.value) {
      dialog.error({
        title: '昵称不能为空',
        positiveText: '确认',
      });
      return;
    }
    if (!newUserRole.value) {
      dialog.error({
        title: '身份不能为空',
        positiveText: '确认',
      });
      return;
    }
    createUser({
      password: newPassword.value,
      username: newUserName.value,
      role: newUserRole.value,
      forceChangePassword: 'true',
      nickname: newNickName.value,
    }).then((res) => {
      if (res.code == 200) {
        dialog.success({
          title: '新建用户成功',
          content: '请提醒此用户及时修改为自己的密码',
          positiveText: '确定',
        });
      } else {
        dialog.error({
          title: '新建用户失败',
          content: res['map_message'],
          positiveText: '确定',
        });
      }
    });
  }
  function doChangePassword() {
    if (newPassword.value != newPasswordConfirm.value) {
      dialog.error({
        title: '两次密码不一致',
        positiveText: '确认',
      });
      return;
    }
    changeUserPassword({
      username: curChangePasswordUserName.value,
      password: newPassword.value,
      forceChangePassword: 'true',
    }).then((res) => {
      showModalChangePassword.value = false;
      if (res.code == 200) {
        dialog.success({
          title: '修改密码成功',
          content: '请提醒此用户及时修改为自己的密码',
          positiveText: '确定',
        });
      } else {
        dialog.error({
          title: '修改密码失败',
          content: res['map_message'],
          positiveText: '确定',
        });
      }
    });
  }
</script>

<style lang="less" scoped></style>
