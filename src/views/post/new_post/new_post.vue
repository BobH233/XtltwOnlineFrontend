<template>
  <div>
    <n-card :bordered="false" title="新建审核申请">
      当你有一篇新的推送想要发出，在这里选择你的秀米账号，以及要审核的图文，然后提交给辅导员审核。<br />
      <b style="text-decoration: underline">建议标题与你的推送标题保持一致！</b>
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
            <n-form-item label="标题" path="title">
              <n-input v-model:value="formValue.title" placeholder="建议与推送标题一致" />
            </n-form-item>
            <n-form-item label="负责辅导员" path="FDYId">
              <n-select
                v-model:value="formValue.FDYId"
                :options="FDYOptions"
                placeholder="选择负责审核的辅导员"
                filterable
              />
            </n-form-item>
            <n-form-item label="秀米账号" path="SessionId">
              <n-select
                v-model:value="formValue.SessionId"
                :options="SessionOptions"
                @update:value="onXiumiSessionSelect"
                placeholder="选择制作推送的秀米账号"
              />
            </n-form-item>
            <n-form-item label="推送文章" path="PaperId1">
              <n-select
                v-model:value="formValue.PaperId"
                :options="PaperOptions"
                filterable
                placeholder="选择需要审核的推送"
                @scroll="handleScroll"
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
  import { useRoute, useRouter } from 'vue-router';
  import { ref, reactive } from 'vue';
  import { useMessage, useDialog, SelectOption } from 'naive-ui';
  import { getUserLists } from '@/api/user/user';
  import { getValidXiumiSessions, getRecentPaper } from '@/api/xiumi/xiumi';
  import { sendNewPost } from '@/api/post/post';

  const dialog = useDialog();
  const route = useRoute();
  const router = useRouter();
  const formRef: any = ref(null);
  const message = useMessage();

  const defaultValueRef = () => ({
    title: '',
    FDYId: '',
    SessionId: '',
    PaperId: '',
  });
  let formValue = reactive(defaultValueRef());

  let FDYOptions: any = ref([]);
  let SessionOptions: any = ref([]);
  let PaperOptions: any = ref([]);
  getUserLists(JSON.stringify(['FDY'])).then((res) => {
    if (res.code == 200) {
      for (let i = 0; i < res.data.length; i++) {
        FDYOptions.value.push({
          label: res.data[i].nickname,
          value: res.data[i]._id,
        });
      }
    } else {
      message.error('无法加载辅导员列表!');
    }
  });
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
    title: {
      required: true,
      message: '标题不能为空!',
      trigger: 'blur',
    },
    FDYId: {
      required: true,
      message: '辅导员ID不能为空!',
    },
    SessionId: {
      required: true,
      message: '秀米账号不能为空!',
    },
    PaperId: {
      required: true,
      message: '推送文章不能为空!',
    },
  };
  let curPaperPage = 0;
  function handleScroll(e: Event) {
    const currentTarget = e.currentTarget as HTMLElement;
    if (formValue.SessionId == '') return;
    if (currentTarget.scrollTop + currentTarget.offsetHeight >= currentTarget.scrollHeight) {
      message.info('正在加载更多...');
      getRecentPaper({
        sessionId: formValue.SessionId,
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
  function doNewPost() {
    formRef.value.validate((errors) => {
      if (!errors) {
        sendNewPost(formValue).then((res) => {
          if (res.code == 200) {
            dialog.success({
              title: '新建申请成功',
              content: '点击跳转到新帖子',
              positiveText: '跳转',
              negativeText: '取消',
              onPositiveClick: () => {
                setTimeout(() => {
                  window['$removeTab'](route);
                  router.push({ name: 'post_detail', params: { id: res.postId } });
                }, 10);
              },
            });
          } else {
            dialog.error({
              title: '新建审核申请失败',
              content: res['map_message'],
              positiveText: '关闭',
            });
          }
        });
      } else {
        message.error('请填写完整信息');
      }
    });
  }
</script>
