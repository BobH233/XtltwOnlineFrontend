<template>
  <div>
    <n-card :bordered="false" title="团委公用转存账号添加">
      只输入秀米的用户名，以及对应的描述，并确保这个公用的转存账号均已经在<router-link
        :to="{ path: '/xiumi/list' }"
        >秀米账号绑定</router-link
      >中完成了绑定！
    </n-card>
    <n-card :bordered="false" class="mt-4 proCard">
      <n-grid cols="1 s:1 m:5 l:5 xl:5 2xl:5" responsive="screen">
        <n-grid-item offset="0 s:0 m:1 l:1 xl:1 2xl:1" span="1 s:1 m:3 l:3 xl:3 2xl:3">
          <n-form
            :label-width="80"
            :model="formValue"
            :rules="rules"
            label-placement="left"
            ref="formRef"
            class="py-8"
          >
            <n-form-item label="秀米账号" path="username">
              <n-input v-model:value="formValue.username" placeholder="秀米注册的邮箱或者手机号" />
            </n-form-item>
            <n-form-item label="描述" path="description">
              <n-input v-model:value="formValue.description" placeholder="输入这个账号的描述" />
            </n-form-item>
            <n-space justify="center">
              <n-button type="primary" @click="doAddPubacc">添加账号</n-button>
            </n-space>
          </n-form>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { useRoute, useRouter } from 'vue-router';
  import { ref, reactive } from 'vue';
  import { useMessage, useDialog } from 'naive-ui';
  import { FormItemRule } from 'naive-ui/lib';
  import { addPubaccs } from '@/api/pubacc/pubacc';

  const dialog = useDialog();
  const route = useRoute();
  const router = useRouter();
  const formRef: any = ref(null);
  const message = useMessage();

  const defaultValueRef = () => ({
    username: '',
    description: '',
  });
  let formValue = reactive(defaultValueRef());
  const rules = {
    username: {
      required: true,
      validator(_rule: FormItemRule, value: string) {
        if (!value || !value.trim()) {
          return new Error('用户名不能为空!');
        }
        return true;
      },
      trigger: 'blur',
    },
    description: {
      required: true,
      message: '请输入新的密码',
      trigger: 'blur',
    },
  };
  function doAddPubacc() {
    addPubaccs(formValue).then((res) => {
      if (res.code == 200) {
        dialog.success({
          title: '添加成功',
          content: '你可以在列表中刷新看到你新添加的账号',
          positiveText: '完成',
          onPositiveClick: () => {
            setTimeout(() => {
              window['$removeTab'](route);
              router.push({ name: 'pubacc_list' });
            }, 10);
          },
        });
      } else {
        message.error('添加失败!');
      }
    });
  }
</script>

<style scoped>
  .captchaImg {
    border: 1px solid rgb(223, 223, 223);
    margin-left: 10px;
    background: white;
    cursor: pointer;
  }
</style>
