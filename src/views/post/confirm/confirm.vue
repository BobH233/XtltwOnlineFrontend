<template>
  <div>
    <n-card :bordered="false" title="手动转存">
      由于一些不可测因素，可能出现秀米会话失效的情况 <br />
      你可以先在<router-link :to="{ path: '/xiumi/list' }">秀米账号绑定</router-link> 中重新绑定
      <br />
      然后在下面指定<strong style="color: red">你的图文存储的秀米账号</strong>，然后尝试再次转存!
    </n-card>
    <n-card :bordered="false" class="mt-4 proCard">
      <n-grid cols="1 s:1 m:7 l:7 xl:7 2xl:7" responsive="screen">
        <n-grid-item offset="0 s:0 m:1 l:1 xl:1 2xl:1" span="1 s:1 m:4 l:4 xl:4 2xl:4">
          <n-form
            :label-width="120"
            :model="formValue"
            :rules="rules"
            label-placement="left"
            ref="formRef"
            class="py-8"
          >
            <n-form-item label="秀米账号" path="SessionId">
              <n-select
                v-model:value="formValue.ManualSessionId"
                :options="SessionOptions"
                placeholder="选择制作推送的秀米账号"
              />
            </n-form-item>
            <n-space justify="center">
              <n-button type="primary" @click="doNewPost">确认发出</n-button>
            </n-space>
          </n-form>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  import { ref, reactive } from 'vue';
  import { useMessage, useDialog } from 'naive-ui';
  import { getValidXiumiSessions } from '@/api/xiumi/xiumi';
  import { confirmTZB } from '@/api/post/post';

  const dialog = useDialog();
  const route = useRoute();
  const formRef: any = ref(null);
  const message = useMessage();
  const postId = route.params['id'];

  const defaultValueRef = () => ({
    postId,
    ManualSessionId: '',
  });
  let formValue = reactive(defaultValueRef());

  let SessionOptions: any = ref([]);

  getValidXiumiSessions().then((res) => {
    if (res.code == 200) {
      for (let i = 0; i < res.data.length; i++) {
        const uaObj = JSON.parse(res.data[i].UserInfo);
        SessionOptions.value.push({
          label: `${uaObj.user.nickname}(${res.data[i].XiumiUsername})`,
          value: res.data[i]._id,
        });
      }
    } else {
      message.error('无法加载秀米账号信息!');
    }
  });
  const rules = {
    SessionId: {
      required: true,
      message: '秀米账号不能为空!',
      validator() {
        const value = formValue.ManualSessionId;
        if (!value) {
          return new Error('秀米账号不能为空!');
        }
        return true;
      },
    },
  };
  function doNewPost() {
    formRef.value.validate((errors) => {
      if (!errors) {
        confirmTZB(formValue).then((res) => {
          if (res.code == 200) {
            dialog.success({
              title: '转存成功',
              content: '接下来，请静静等待你的推送被发送',
              positiveText: '确定',
              onPositiveClick: () => {
                setTimeout(() => {
                  window['$removeTab'](route);
                }, 100);
              },
            });
          } else {
            dialog.error({
              title: '转存失败',
              content: `Reason: ${res.data.errorMsg}`,
              positiveText: '确定',
            });
          }
        });
      } else {
        message.error('请填写完整信息!');
      }
    });
  }
</script>
