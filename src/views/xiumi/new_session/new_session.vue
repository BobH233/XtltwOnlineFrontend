<template>
  <div>
    <n-card :bordered="false" title="秀米账号绑定">
      输入你的秀米账号密码，登录后服务器会自动处理你的信息。
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
            <n-form-item label="新密码" path="password">
              <n-input
                v-model:value="formValue.password"
                placeholder="输入新密码"
                type="password"
                showPasswordOn="click"
              />
            </n-form-item>
            <n-form-item label="验证码" path="captcha" v-show="needCaptcha">
              <n-input v-model:value="formValue.captcha" placeholder="验证码" />
              <div class="captchaImg">
                <img :src="svgData" v-show="needCaptcha" @click="refreshCaptcha" />
              </div>
            </n-form-item>
            <n-space justify="center">
              <n-button type="primary" @click="doXiumiLogin">添加账号</n-button>
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
  import { checkCaptcha, getNewCaptcha, xiumiSessionLogin } from '@/api/xiumi/xiumi';

  const dialog = useDialog();
  const route = useRoute();
  const router = useRouter();
  const formRef: any = ref(null);
  const message = useMessage();

  const defaultValueRef = () => ({
    username: '',
    password: '',
    captcha: '',
  });
  let svgData = ref('');
  const needCaptcha = ref(false);
  let formValue = reactive(defaultValueRef());
  const rules = {
    username: {
      required: true,
      validator(_rule: FormItemRule, value: string) {
        if (!value || !value.trim()) {
          return new Error('用户名不能为空!');
        }
        CheckCaptcha(value);
        return true;
      },
      trigger: 'blur',
    },
    password: {
      required: true,
      message: '请输入新的密码',
      trigger: 'blur',
    },
    captcha: {
      trigger: 'blur',
      required: true,
      validator(_rule: FormItemRule, value: string) {
        if (!needCaptcha.value) return true;
        if (!value || !value.trim()) {
          return new Error('验证码不能为空!');
        }
        return true;
      },
    },
  };
  function doXiumiLogin() {
    xiumiSessionLogin(formValue).then((res) => {
      if (res.code == 200) {
        dialog.success({
          title: '添加成功',
          content: '你可以在列表中刷新看到你新添加的账号',
          positiveText: '完成',
          onPositiveClick: () => {
            setTimeout(() => {
              window['$removeTab'](route);
              router.push({ name: 'xiumi_session_list' });
            }, 10);
          },
        });
      } else {
        if (res.detail.is_wrong_account) {
          message.error('秀米账号或密码错误!');
        } else if (res.detail.is_wrong_captcha) {
          message.error('验证码错误!');
          refreshCaptcha();
        } else {
          message.error('未知错误: ' + JSON.stringify(res.detail));
        }
      }
    });
  }
  function CheckCaptcha(username) {
    checkCaptcha(username).then((res) => {
      if (res.code == 200) {
        needCaptcha.value = res.needCaptcha;
        svgData.value = 'data:image/svg+xml;base64,' + res.svgData;
      } else {
        message.error('获取验证码失败!');
      }
    });
  }

  function refreshCaptcha() {
    getNewCaptcha().then((res) => {
      if (res.code == 200) {
        svgData.value = 'data:image/svg+xml;base64,' + res.svgData;
      } else {
        message.error('获取验证码失败!');
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
