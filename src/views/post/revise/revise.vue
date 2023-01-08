<template>
  <div>
    <n-card :bordered="false" title="审核修订">
      请务必保证按照辅导员的要求，在秀米上对原推送进行了修改 <br />
      <strong style="color: red">确保最后点击秀米编辑界面上方-预览-分享-申请审核！</strong> <br />
      如果你是在原秀米图文上进行的更改，请选择<strong style="color: red">“旧图文”</strong>选项。
      <br />
      如果你是新建了秀米图文并进行更改，请选择<strong style="color: red">“新图文”</strong
      >选项，并选择新的秀米图文！ <br />
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
            <n-form-item label="图文状态" path="PaperOption">
              <n-radio-group v-model:value="formValue.updatePaperId" name="PaperOption1">
                <n-radio-button key="false" value="false" label="旧图文" />
                <n-radio-button key="true" value="true" label="新图文" />
              </n-radio-group>
            </n-form-item>
            <n-form-item
              label="秀米账号"
              path="SessionId"
              v-show="formValue.updatePaperId == 'true'"
            >
              <n-select
                v-model:value="formValue.newSessionId"
                :options="SessionOptions"
                @update:value="onXiumiSessionSelect"
                placeholder="选择制作推送的秀米账号"
              />
            </n-form-item>
            <n-form-item
              label="推送文章"
              path="PaperId1"
              v-show="formValue.updatePaperId == 'true'"
            >
              <n-select
                v-model:value="formValue.newPaperId"
                :options="PaperOptions"
                filterable
                placeholder="选择需要审核的推送"
                @scroll="handleScroll"
              />
            </n-form-item>
            <n-space justify="center">
              <n-button type="primary" @click="doRequireRecheck">确认发出</n-button>
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
  import { useMessage, useDialog, SelectOption, NRadioButton } from 'naive-ui';
  import { getValidXiumiSessions, getRecentPaper } from '@/api/xiumi/xiumi';
  import { requireRecheck } from '@/api/post/post';

  const dialog = useDialog();
  const route = useRoute();
  const formRef: any = ref(null);
  const message = useMessage();
  const postId = route.params['id'];

  const defaultValueRef = () => ({
    postId: postId,
    updatePaperId: 'false',
    newSessionId: '',
    newPaperId: '',
  });
  let formValue = reactive(defaultValueRef());

  let SessionOptions: any = ref([]);
  let PaperOptions: any = ref([]);

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
        const value = formValue.newSessionId;
        if (formValue.updatePaperId == 'false') return true;
        if (!value) {
          return new Error('秀米账号不能为空!');
        }
        return true;
      },
    },
    PaperId1: {
      required: true,
      message: '推送文章不能为空!',
      validator() {
        const value = formValue.newPaperId;
        if (formValue.updatePaperId == 'false') return true;
        if (!value) {
          return new Error('秀米账号不能为空!');
        }
        return true;
      },
    },
  };
  let curPaperPage = 0;
  function handleScroll(e: Event) {
    const currentTarget = e.currentTarget as HTMLElement;
    if (formValue.newSessionId == '') return;
    if (currentTarget.scrollTop + currentTarget.offsetHeight >= currentTarget.scrollHeight) {
      message.info('正在加载更多...');
      getRecentPaper({
        sessionId: formValue.newSessionId,
        pageLimit: 10,
        page: curPaperPage + 1,
      }).then((res) => {
        if (res.code == 200) {
          if (res.data.length == 0) {
            message.info('已全部加载完毕!');
          }
          for (let i = 0; i < res.data.length; i++) {
            PaperOptions.value.push({
              label: res.data[i].title,
              value: res.data[i].show_id,
            });
          }
          curPaperPage++;
        } else {
          message.error('无法加载秀米文章列表!');
        }
      });
    }
  }
  function onXiumiSessionSelect(value: string, _option: SelectOption) {
    PaperOptions.value = [];
    curPaperPage = 0;
    getRecentPaper({
      sessionId: value,
      pageLimit: 10,
      page: 0,
    }).then((res) => {
      if (res.code == 200) {
        for (let i = 0; i < res.data.length; i++) {
          PaperOptions.value.push({
            label: res.data[i].title,
            value: res.data[i].show_id,
          });
        }
      } else {
        message.error('无法加载秀米文章列表!');
      }
    });
  }
  function doRequireRecheck() {
    formRef.value.validate((errors) => {
      if (!errors) {
        requireRecheck(formValue).then((res) => {
          if (res.code == 200) {
            dialog.success({
              title: '申请复审成功',
              content: '请等待辅导员再次审核',
              positiveText: '确认',
              onPositiveClick: () => {
                setTimeout(() => {
                  window['$removeTab'](route);
                }, 10);
              },
            });
          } else {
            dialog.error({
              title: '申请复审失败',
              content: res['map_message'],
            });
          }
        });
      } else {
        message.error('请填写完整信息!');
      }
    });
  }
</script>
