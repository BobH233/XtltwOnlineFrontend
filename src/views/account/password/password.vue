<template>
  <n-card :bordered="false" title="修改密码">
    为了保证账户安全，请务必修改默认密码，并注意密码强度。
  </n-card>
  <n-card :bordered="false" class="mt-4 proCard">
    <n-grid cols="1 s:1 m:3 l:3 xl:3 2xl:3" responsive="screen">
      <n-grid-item offset="0 s:0 m:1 l:1 xl:1 2xl:1">
        <n-form
          :label-width="80"
          :model="formValue"
          :rules="rules"
          label-placement="left"
          ref="formRef"
          class="py-8"
        >
          <n-form-item label="原密码" path="oldPassword">
            <n-input
              v-model:value="formValue.oldPassword"
              placeholder="输入原始密码"
              type="password"
              showPasswordOn="click"
            />
          </n-form-item>
          <n-form-item label="新密码" path="newPassword">
            <n-input
              v-model:value="formValue.newPassword"
              placeholder="输入新密码"
              type="password"
              showPasswordOn="click"
            />
          </n-form-item>
          <n-space justify="center">
            <n-button type="primary" @click="formSubmit">确认修改</n-button>
          </n-space>
        </n-form>
      </n-grid-item>
    </n-grid>
  </n-card>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useMessage, useDialog } from 'naive-ui';
  import { changeMyPassword } from '@/api/user/user';

  const dialog = useDialog();
  const formRef: any = ref(null);
  const message = useMessage();
  const defaultValueRef = () => ({
    oldPassword: '',
    newPassword: '',
  });
  let formValue = reactive(defaultValueRef());
  const rules = {
    oldPassword: {
      required: true,
      message: '请输入原始密码',
      trigger: 'blur',
    },
    newPassword: {
      required: true,
      message: '请输入新的密码',
      trigger: 'blur',
    },
  };
  function formSubmit() {
    formRef.value.validate((errors) => {
      if (!errors) {
        changeMyPassword(formValue).then((res) => {
          if (res.code == 200) {
            dialog.success({
              title: '修改密码成功',
              content: '所有设备已下线，请重新登录',
              positiveText: '确定',
              onPositiveClick: () => {
                location.reload();
              },
            });
          } else {
            dialog.error({
              title: '修改密码失败',
              content: res['map_message'],
              positiveText: '确定',
            });
          }
        });
      } else {
        message.error('请填写正确的信息');
      }
    });
  }
</script>
