<template>
  <div class="view-account">
    <div class="view-account-header"></div>
    <div class="view-account-container">
      <div class="view-account-top">
        <h1>徐特立团委在线审核平台</h1>
        <div class="view-account-top-desc">{{ pkg.version }} @ {{ lastBuildTime }}</div>
      </div>
      <div class="view-account-form">
        <n-form
          ref="formRef"
          label-placement="left"
          size="large"
          :model="formInline"
          :rules="rules"
        >
          <n-form-item path="username">
            <n-input v-model:value="formInline.username" placeholder="请输入用户名">
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <PersonOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item path="password">
            <n-input
              v-model:value="formInline.password"
              type="password"
              showPasswordOn="click"
              placeholder="请输入密码"
            >
              <template #prefix>
                <n-icon size="18" color="#808695">
                  <LockClosedOutline />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>
          <n-form-item class="default-color">
            <div class="flex justify-between">
              <div class="flex-initial">
                <n-checkbox v-model:checked="rememberForMonth">记住登录一个月</n-checkbox>
              </div>
            </div>
          </n-form-item>
          <n-form-item>
            <n-button type="primary" @click="handleSubmit" size="large" :loading="loading" block>
              登录
            </n-button>
          </n-form-item>
          <n-form-item>
            <n-button type="success" @click="handleFido2" size="large" :loading="loading" block>
              生物验证登录
            </n-button>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref, unref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useUserStore } from '@/store/modules/user';
  import { useMessage } from 'naive-ui';
  import { ResultEnum } from '@/enums/httpEnum';
  import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5';
  import { PageEnum } from '@/enums/pageEnum';
  import { fido2GetLoginOptions, fido2Login } from '@/api/user/user';
  import { _arrayBufferToBase64, _base64ToArrayBuffer } from '@/utils';
  interface FormState {
    username: string;
    password: string;
    remember: Boolean;
  }

  const { pkg, lastBuildTime } = __APP_INFO__;

  const formRef = ref();
  const message = useMessage();
  const loading = ref(false);
  const rememberForMonth = ref(true);

  const LOGIN_NAME = PageEnum.BASE_LOGIN_NAME;

  const formInline = reactive({
    username: '',
    password: '',
  });

  const rules = {
    username: { required: true, message: '请输入用户名', trigger: 'blur' },
    password: { required: true, message: '请输入密码', trigger: 'blur' },
  };

  const userStore = useUserStore();

  const router = useRouter();
  const route = useRoute();
  const handleFido2 = async (e) => {
    e.preventDefault();
    if (!formInline.username || !formInline.username.trim()) {
      message.error('你需要提供你的用户名以生物验证登录!');
      return;
    }
    const loginOptionsRes = await fido2GetLoginOptions(formInline.username);
    if (loginOptionsRes.code != 200) {
      message.error(loginOptionsRes['map_message']);
      return;
    }
    let loginOptions = loginOptionsRes.loginOptions;
    loginOptions.challenge = _base64ToArrayBuffer(loginOptions.challenge);
    for (let i = 0; i < loginOptions.allowCredentials.length; i++) {
      loginOptions.allowCredentials[i].id = _base64ToArrayBuffer(
        loginOptions.allowCredentials[i].id
      );
    }
    navigator.credentials.get({ publicKey: loginOptions }).then((credential: any) => {
      const passableCredential = {
        id: credential?.id,
        rawId: _arrayBufferToBase64(credential.rawId),
        response: {
          clientDataJSON: _arrayBufferToBase64(credential.response.clientDataJSON),
          authenticatorData: _arrayBufferToBase64(credential.response.authenticatorData),
          signature: _arrayBufferToBase64(credential.response.signature),
          userHandle: _arrayBufferToBase64(credential.rawId),
        },
        type: credential.type,
      };
      fido2Login({
        username: formInline.username,
        loginParam: JSON.stringify(passableCredential),
        remember: rememberForMonth.value,
      }).then(async (res) => {
        if (res.code == 200) {
          message.success('登录成功，即将进入系统');
          await userStore.fido2Logined(res['user']);
          const toPath = decodeURIComponent((route.query?.redirect || '/') as string);
          if (route.name === LOGIN_NAME) {
            router.replace('/');
          } else {
            router.replace(toPath);
          }
        } else {
          message.error(res['map_message']);
        }
      });
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    formRef.value.validate(async (errors) => {
      if (!errors) {
        const { username, password } = formInline;
        message.loading('登录中...');
        loading.value = true;

        const params: FormState = {
          username,
          password,
          remember: unref(rememberForMonth),
        };

        try {
          const { code, map_message: msg, user } = await userStore.login(params);
          message.destroyAll();
          if (code == ResultEnum.SUCCESS) {
            const toPath = decodeURIComponent((route.query?.redirect || '/') as string);
            message.success('登录成功，即将进入系统');
            if (user.forceChangePassword) {
              location.href = '/#/account/password?tipChange=1';
              location.reload();
            }
            if (route.name === LOGIN_NAME) {
              router.replace('/');
            } else {
              router.replace(toPath);
            }
          } else {
            message.info(msg || '登录失败');
          }
        } finally {
          loading.value = false;
        }
      } else {
        message.error('信息填写不完整!');
      }
    });
  };
</script>

<style lang="less" scoped>
  .view-account {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: auto;

    &-container {
      flex: 1;
      padding: 32px 12px;
      max-width: 384px;
      min-width: 320px;
      margin: 0 auto;
    }

    &-top {
      padding: 32px 0;
      text-align: center;

      &-desc {
        font-size: 14px;
        color: #808695;
      }
    }

    &-other {
      width: 100%;
    }

    .default-color {
      color: #515a6e;

      .ant-checkbox-wrapper {
        color: #515a6e;
      }
    }
  }

  @media (min-width: 768px) {
    .view-account {
      background-image: url('../../assets/images/login.svg');
      background-repeat: no-repeat;
      background-position: 50%;
      background-size: 100%;
    }

    .page-account-container {
      padding: 32px 0 24px 0;
    }
  }
</style>
