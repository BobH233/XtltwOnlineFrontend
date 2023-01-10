<template>
  <div>
    <div class="n-layout-page-header" v-show="notFound">
      <n-card :bordered="false">
        <template #header>
          <n-icon size="30" color="#ff7d67">
            <CloseCircleFilled />
          </n-icon>
          无法找到申请
        </template>
        检查你是否有权限访问这篇申请，或者该申请已被撤回!
      </n-card>
    </div>
    <div class="cardMargin" v-show="!notFound">
      <n-card :bordered="false">
        <template #header>
          <n-skeleton v-if="loading" text width="60%" />
          <template v-else> {{ postData.Title }} </template>
        </template>
        <template #header-extra>
          <n-tag :type="PostStatusTag.type">
            <template #icon>
              <n-icon :component="PostStatusTag.icon" />
            </template>
            {{ PostStatusTag.statusText }}
          </n-tag>
        </template>
        <n-skeleton v-if="loading" text :repeat="6" />
        <template v-else>
          <n-space vertical>
            <n-steps :current="(currentStep as number)" status="process">
              <n-step
                title="待辅导员通过"
                description="辅导员检查推送并提出修改意见，待团支部修改，最终通过"
              />
              <n-step title="待转存" description="辅导员审核已通过，团支部需要确认转存给团委" />
              <n-step
                title="待团委通过"
                description="团委干事再次检查推送内容并进行修改，然后通过"
              />
              <n-step
                title="待新媒发出"
                description="新媒体中心将进行再次检查，推送最终进入待发出列表"
              />
              <n-step title="已发出" description="您的推送已经发送至公众号，请注意查看" />
            </n-steps>
            <n-data-table
              :columns="ResPeopleColumns"
              :data="ResPeopleData"
              :pagination="false"
              :bordered="true"
            />
            <n-data-table
              :columns="ForwardAccountColumns"
              :data="ForwardAccountData"
              :pagination="false"
              :bordered="true"
              v-show="Role == 'TwAdmin' || Role == 'TwMember'"
            />
          </n-space>
        </template>
      </n-card>
    </div>
    <div
      class="cardMargin"
      v-show="!notFound && !loading && Role == 'TZB' && postData.PostStatus == 'ToRevise'"
    >
      <n-card :bordered="false" title="申请复审">
        <n-space vertical>
          在你按照辅导员要求修改后，可以点击此处请求辅导员复审。
          <n-space>
            <n-button n-button @click="openReviseTab" type="primary">申请复审</n-button>
          </n-space>
        </n-space>
      </n-card>
    </div>
    <div
      class="cardMargin"
      v-show="!notFound && !loading && (Role == 'FDY' || Role == 'TwAdmin' || Role == 'TwMember')"
    >
      <n-card :bordered="false" title="审核检查入口">
        <n-space vertical>
          <div
            >这是团支部转存的原始版本，假如团委进行了修改，请在下面”推送修改检查“查看修改后的结果</div
          >
          <n-space>
            <n-button n-button @click="openPaperPreviewUrl" type="primary">打开预览链接</n-button>
            <n-button @click="openPaperPreviewCover" v-show="coverPreviewUrl != ''"
              >打开封面预览</n-button
            >
          </n-space>
          <n-collapse>
            <n-collapse-item title="扫码预览" name="1">
              <vue-qr :text="paperPreviewUrl" />
            </n-collapse-item>
          </n-collapse>
        </n-space>
      </n-card>
    </div>
    <div
      class="cardMargin"
      v-show="
        !notFound &&
        !loading &&
        ((Role == 'TwMember' && postData.PostStatus == 'TWChecking') ||
          (Role == 'TwAdmin' && postData.PostStatus == 'TWToCheck'))
      "
    >
      <n-card :bordered="false" title="推送修改检查入口">
        <n-space vertical>
          <div
            >假如你在待审核的帖子上做了修改，请在秀米中申请审核，然后再在这里预览查看是否更新</div
          >
          <strong style="color: red">请确保这里的预览已经生效后，再进行通过！</strong>
          <n-space>
            <n-button n-button @click="openTwPaperPreviewUrl" type="primary">打开预览链接</n-button>
            <n-button @click="openTwPaperPreviewCover" v-show="coverPreviewUrl != ''"
              >打开封面预览</n-button
            >
          </n-space>
          <n-collapse>
            <n-collapse-item title="扫码预览" name="1">
              <vue-qr :text="paperTwPreviewUrl" />
            </n-collapse-item>
          </n-collapse>
        </n-space>
      </n-card>
    </div>
    <div class="cardMargin">
      <n-card :bordered="false" title="申请详情" v-show="!notFound && !loading">
        <n-collapse>
          <n-collapse-item title="原秀米推送快照" name="1">
            <n-data-table
              :columns="XiumiSnapshotColumns"
              :data="XiumiSnapshotData"
              :pagination="false"
              :bordered="true"
            />
          </n-collapse-item>
          <n-collapse-item title="审核时间线" name="2">
            <n-timeline>
              <n-timeline-item
                v-for="timelineItem in TimelineItems"
                :type="timelineItem.type"
                :title="timelineItem.title"
                :content="timelineItem.content"
                :time="timelineItem.time"
                :key="timelineItem._id"
              />
            </n-timeline>
          </n-collapse-item>
        </n-collapse>
      </n-card>
    </div>
    <div class="cardMargin">
      <n-card :bordered="false" title="评论" v-show="!notFound && !loading">
        <n-list>
          <n-list-item v-for="comment in commentData" :key="comment._id">
            <n-thing>
              <template #avatar>
                <n-avatar round>
                  {{ comment.user.nickname[0] }}
                  <template #icon>
                    <UserOutlined />
                  </template>
                </n-avatar>
              </template>
              <template #header>
                <n-space>
                  <div style="commentHeader">{{ comment.user.nickname }}</div>
                  <n-tag :bordered="true" type="info" size="small">
                    {{ RoleNameMap[comment.user.role] }}
                  </n-tag>
                </n-space>
              </template>
              <template #description>
                <div class="commentDate">{{ comment.DateString }}</div>
              </template>
              <div class="ql-snow commentMargin">
                <div class="ql-editor">
                  <div class="commentLimiter" v-html="comment.HTMLContent"></div>
                </div>
              </div>
            </n-thing>
          </n-list-item>
        </n-list>
      </n-card>
    </div>
    <div class="cardMargin">
      <n-card :bordered="false" title="操作" v-show="!notFound && !loading">
        <n-space vertical>
          <n-space :wrap-item="false">
            <n-button type="primary" @click="doMakeComment"> 评论 </n-button>
            <n-button
              type="error"
              @click="doMakeCommentAndReject"
              v-show="Role == 'FDY' && postData.PostStatus == 'FDYCheck'"
            >
              评论并驳回
            </n-button>
            <n-button
              type="success"
              @click="doPassPostFDY"
              v-show="Role == 'FDY' && postData.PostStatus == 'FDYCheck'"
            >
              通过
            </n-button>
            <n-button
              type="success"
              @click="showModalPass = true"
              v-show="Role == 'TwAdmin' && postData.PostStatus == 'TWToCheck'"
            >
              直接通过
            </n-button>
            <n-button
              type="success"
              @click="showModalPass = true"
              v-show="Role == 'TwMember' && postData.PostStatus == 'TWChecking'"
            >
              通过
            </n-button>
            <n-button
              type="primary"
              @click="showModalArrange = true"
              v-show="Role == 'TwAdmin' && postData.PostStatus == 'TWToCheck'"
            >
              安排干事
            </n-button>
            <n-button @click="CopyPaperForwardNotion" v-show="postData.PostStatus == 'Sending'">
              复制通知信息
            </n-button>
          </n-space>
          <n-space>
            <QuillEditor
              ref="quillEditor"
              @ready="readyQuill"
              :options="EditorOptions"
              v-model:content="CommentContent"
              style="height: 350px"
              class="quillEditor"
              theme="snow"
            />
          </n-space>
        </n-space>
      </n-card>
    </div>
    <n-modal v-model:show="showModalPass">
      <n-card
        style="width: 600px"
        title="直接通过推送"
        :bordered="true"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-form
          :label-width="120"
          :rules="passFormRules"
          label-placement="left"
          ref="formRef"
          class="py-8"
        >
          <n-form-item label="新媒秀米账号" path="forwardTarget">
            <n-input v-model:value="forwardTarget" placeholder="请输入新媒体的秀米账号" />
          </n-form-item>
          <n-space justify="center">
            <n-button type="primary" @click="doPassPostTW">确认安排</n-button>
          </n-space>
        </n-form>
      </n-card>
    </n-modal>
    <n-modal v-model:show="showModalArrange">
      <n-card
        style="width: 600px"
        title="安排干事审核"
        :bordered="true"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-form
          :label-width="140"
          :rules="twmemberFormRules"
          label-placement="left"
          ref="formRef"
          class="py-8"
        >
          <n-form-item label="团委干事账号" path="TwMemberId">
            <n-select
              v-model:value="arrageMemberId"
              :options="TwMemberOptions"
              placeholder="选择负责审核的团委干事"
              filterable
              @update:value="onTwMemberSelected"
            />
          </n-form-item>
          <n-form-item label="团委干事秀米账号" path="TwMemberSessionId">
            <n-select
              v-model:value="arrangeMemberSessionId"
              :options="TwMemberSessionOptions"
              placeholder="选择该干事的秀米账号"
              filterable
            />
          </n-form-item>
          <n-space justify="center">
            <n-button type="primary" @click="doArrangeTwMember">确认通过</n-button>
          </n-space>
        </n-form>
      </n-card>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, h, reactive } from 'vue';
  import { useRoute } from 'vue-router';
  import {
    CheckCircleFilled,
    CloseCircleFilled,
    FrownFilled,
    MailFilled,
    MehFilled,
    SecurityScanFilled,
    SmileFilled,
    TeamOutlined,
    UserOutlined,
    WechatFilled,
  } from '@vicons/antd';
  import {
    getPostDetail,
    requireRevise,
    sendComment,
    passPostFDY,
    passPostTW,
    twArrangeTwMember,
  } from '@/api/post/post';
  import { getOtherUserInfo, getUserLists } from '@/api/user/user';
  import {
    NButton,
    NCollapse,
    NCollapseItem,
    NTimeline,
    NTimelineItem,
    useDialog,
    useMessage,
  } from 'naive-ui';
  import { dateFormat, renderIcon } from '@/utils';
  import { QuillEditor } from '@vueup/vue-quill';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
  import { useUserStore } from '@/store/modules/user';
  import vueQr from 'vue-qr/src/packages/vue-qr.vue';
  import router from '@/router';
  import { FullCapNotion, PaperForwardNotion } from '@/constant/constant';
  import { getOtherUserSessions, getValidXiumiSessions } from '@/api/xiumi/xiumi';
  import { getPubaccs } from '@/api/pubacc/pubacc';
  import { BindQuillUploadImageInterface } from './quillImgUpload';

  const route = useRoute();
  const userStore = useUserStore();
  const Role = userStore.getRole;
  const message = useMessage();
  const postId = route.params['id'];
  const notFound = ref(false);
  const loading = ref(true);
  const dialog = useDialog();
  const TimelineItems: any = ref([]);
  const PostStatusTag = ref({
    icon: undefined,
    statusText: '',
    type: '',
  });
  const formRef: any = ref(null);
  const XiumiSnapshotColumns = [
    {
      title: '属性',
      key: 'attr',
      resizable: true,
    },
    {
      title: '值',
      key: 'val',
      resizable: true,
    },
  ];
  const ResPeopleColumns = [
    {
      title: '身份',
      key: 'description',
      resizable: true,
    },
    {
      title: '用户',
      key: 'user',
      resizable: true,
      render(row, _index) {
        return h(
          NButton,
          {
            size: 'small',
            type: 'success',
            onClick: () => {
              // TODO: 打开用户详情
            },
          },
          {
            icon: renderIcon(TeamOutlined),
            default: row.user.nickname,
          }
        );
      },
    },
  ];
  // 用于显示
  const ForwardAccountColumns = [
    {
      title: '目标',
      key: 'description',
      resizable: true,
    },
    {
      title: '秀米账号',
      key: 'user',
      resizable: true,
      render(row, _index) {
        return h(
          NButton,
          {
            size: 'small',
            type: 'success',
            onClick: () => {
              // TODO: 打开用户详情
              window.open('https://xiumi.us/');
            },
          },
          {
            icon: renderIcon(WechatFilled),
            default: `${row.user.username}(${row.user.description})`,
          }
        );
      },
    },
  ];

  const XiumiSnapshotData: any = ref([]);
  const ResPeopleData: any = ref([]);
  const ForwardAccountData: any = ref([]);
  const paperPreviewUrl = ref('');
  const coverPreviewUrl = ref('');
  const TWpaperPreviewUrl = ref(''); // 团委/干事 公用账号上修改版本预览链接
  const TWcoverPreviewUrl = ref(''); //团委/干事 账号上修改版本封面预览链接
  function openPaperPreviewUrl() {
    window.open(paperPreviewUrl.value);
  }
  function openPaperPreviewCover() {
    console.log(coverPreviewUrl.value);
    if (coverPreviewUrl.value == 'http://') {
      dialog.info({
        title: '提示',
        content: '这篇推送没有设定封面',
        positiveText: '确定',
      });
      return;
    }
    window.open(coverPreviewUrl.value);
  }
  const postData: any = ref({
    OwnerId: '',
    Title: '',
    FDYInCharge: '',
    TwMemberInCharge: '',
    PostStatus: '',
    TimeLine: [],
    XiumiSessionId: '',
    XiumiPaperInfo: '',
    TZBForwardPaperInfo: '',
    TZBForwardPaperAccountId: '',
    pubaccPaperId: '',
    TWArrangeForwardPaperInfo: '',
    TWArrangeForwardSessionId: '',
    TWForwardPaperInfo: '',
    SendingDate: '',
  });
  const commentData: any = ref([]);
  const currentStep = ref(2);
  const RoleNameMap = {
    WebAdmin: '网站管理员',
    FDY: '辅导员',
    TwAdmin: '团委管理员',
    TZB: '团支部',
    TwMember: '团委干事',
  };
  const paperTwPreviewUrl = ref('');
  function openTwPaperPreviewUrl() {
    window.open(TWpaperPreviewUrl.value);
  }
  function openTwPaperPreviewCover() {
    if (TWcoverPreviewUrl.value == 'http://') {
      dialog.info({
        title: '提示',
        content: '这篇推送没有设定封面',
        positiveText: '确定',
      });
      return;
    }
    window.open(TWcoverPreviewUrl.value);
  }
  function getXiumiSnapshotData() {
    const xiumiInfoObj = JSON.parse(postData.value.XiumiPaperInfo);
    paperPreviewUrl.value = xiumiInfoObj.data.show_url;
    coverPreviewUrl.value = 'http://' + xiumiInfoObj.data.cover.replace('//', '');
    if (Role == 'TwAdmin' && postData.value.TZBForwardPaperInfo) {
      TWpaperPreviewUrl.value = JSON.parse(postData.value.TZBForwardPaperInfo).show_url;
      TWcoverPreviewUrl.value =
        'http://' + JSON.parse(postData.value.TZBForwardPaperInfo).cover.replace('//', '');
      paperTwPreviewUrl.value = TWpaperPreviewUrl.value;
    } else if (Role == 'TwMember' && postData.value.TWArrangeForwardPaperInfo) {
      TWpaperPreviewUrl.value = JSON.parse(postData.value.TWArrangeForwardPaperInfo).show_url;
      TWcoverPreviewUrl.value =
        'http://' + JSON.parse(postData.value.TWArrangeForwardPaperInfo).cover.replace('//', '');
      paperTwPreviewUrl.value = TWpaperPreviewUrl.value;
    }
    XiumiSnapshotData.value.push({
      attr: '文章id',
      val: xiumiInfoObj.data.show_id,
    });
    XiumiSnapshotData.value.push({
      attr: '文章标题',
      val: xiumiInfoObj.data.title,
    });
    XiumiSnapshotData.value.push({
      attr: '文章描述',
      val: xiumiInfoObj.data.desc,
    });
    XiumiSnapshotData.value.push({
      attr: '预览链接',
      val: xiumiInfoObj.data.show_url,
    });
    XiumiSnapshotData.value.push({
      attr: '封面链接',
      val: xiumiInfoObj.data.cover,
    });
  }
  function getResPeopleData() {
    ResPeopleData.value.push({
      description: '发起人',
      user: postData.value['OwnerUser'].user,
    });
    ResPeopleData.value.push({
      description: '负责辅导员',
      user: postData.value['FDYUser'].user,
    });
    if (postData.value['TWMemberUser'])
      ResPeopleData.value.push({
        description: '负责审核干事',
        user: postData.value['TWMemberUser'].user,
      });
  }
  async function getForwardAccountData() {
    if (Role == 'TwAdmin') {
      const ForwardPaperAccountId = postData.value['TZBForwardPaperAccountId'];
      if (!ForwardPaperAccountId) return;
      const XiumiPubaccs = await getPubaccs();
      for (let i = 0; i < XiumiPubaccs.data.length; i++) {
        if (XiumiPubaccs.data[i]._id == ForwardPaperAccountId) {
          ForwardAccountData.value.push({
            description: '团委公众账号存储至',
            user: XiumiPubaccs.data[i],
          });
        }
        break;
      }
    } else if (Role == 'TwMember') {
      const TWArrangeForwardSessionId = postData.value['TWArrangeForwardSessionId'];
      if (!TWArrangeForwardSessionId) return;
      const SessionsInfo = await getValidXiumiSessions();
      for (let i = 0; i < SessionsInfo.data.length; i++) {
        if (SessionsInfo.data[i]._id == TWArrangeForwardSessionId) {
          ForwardAccountData.value.push({
            description: '团委干事账号存储至',
            user: {
              username: SessionsInfo.data[i].XiumiUsername,
              description: JSON.parse(SessionsInfo.data[i].UserInfo).user.nickname,
            },
          });
          break;
        }
      }
    }
  }
  function getTimelineItems() {
    const poststatusMap = {
      FDYCheck: {
        title: '待辅导员检查',
        content: '等待辅导员查看并提出修改意见',
        type: 'info',
      },
      ToRevise: {
        title: '待修改',
        content: '辅导员提出了修改意见',
        type: 'error',
      },
      FDYPass: {
        title: '辅导员通过',
        content: '辅导员已经审核通过',
        type: 'success',
      },
      TWToCheck: {
        title: '待团委检查',
        content: '等待团委分配检查任务',
        type: 'info',
      },
      TWChecking: {
        title: '团委正检查',
        content: '团委干事正在检查并修改你的推送',
        type: 'info',
      },
      Sending: {
        title: '待新媒体发送',
        content: '推送转存至新媒体账号，等待发送',
        type: 'info',
      },
      Sended: {
        title: '已发送',
        content: '推送成功发送至公众号',
        type: 'success',
      },
    };
    for (let i = 0; i < postData.value.TimeLine.length; i++) {
      const mpItem = poststatusMap[postData.value.TimeLine[i].status];
      const statusDate = new Date(parseInt(postData.value.TimeLine[i].UpdateTime));
      TimelineItems.value.push({
        type: mpItem.type,
        title: mpItem.title,
        content: mpItem.content,
        time: dateFormat('YYYY-mm-dd HH:MM:SS', statusDate),
        _id: postData.value.TimeLine[i]._id,
      });
    }
  }
  getPostDetail(postId).then(async (postDetail) => {
    const PostStatusMap = {
      FDYCheck: {
        type: 'warning',
        icon: MehFilled,
        tips: '待辅导员审核',
      },
      ToRevise: {
        type: 'error',
        icon: FrownFilled,
        tips: '待修改',
      },
      FDYPass: {
        type: 'success',
        icon: SmileFilled,
        tips: '辅导员审核通过',
      },
      TWToCheck: {
        type: 'warning',
        icon: TeamOutlined,
        tips: '待团委审核',
      },
      TWChecking: {
        type: 'warning',
        icon: SecurityScanFilled,
        tips: '团委正审核',
      },
      Sending: {
        type: 'success',
        icon: MailFilled,
        tips: '待新媒发送',
      },
      Sended: {
        type: 'info',
        icon: CheckCircleFilled,
        tips: '已发出',
      },
    };
    if (postDetail.code == 200) {
      postData.value = postDetail.post_data;
      postData.value['OwnerUser'] = await getOtherUserInfo(postDetail.post_data.OwnerId);
      postData.value['FDYUser'] = await getOtherUserInfo(postDetail.post_data.FDYInCharge);
      PostStatusTag.value.icon = PostStatusMap[postDetail.post_data.PostStatus].icon;
      PostStatusTag.value.statusText = PostStatusMap[postDetail.post_data.PostStatus].tips;
      PostStatusTag.value.type = PostStatusMap[postDetail.post_data.PostStatus].type;
      if (postDetail.post_data.TwMemberInCharge)
        postData.value['TWMemberUser'] = await getOtherUserInfo(
          postDetail.post_data.TwMemberInCharge
        );
      getXiumiSnapshotData();
      getResPeopleData();
      getTimelineItems();
      await getForwardAccountData();
      const currentStepMap = {
        FDYCheck: 1,
        ToRevise: 1,
        FDYPass: 2,
        TWToCheck: 3,
        TWChecking: 3,
        Sending: 4,
        Sended: 5,
      };
      currentStep.value = currentStepMap[postDetail.post_data.PostStatus];
      for (let i = 0; i < postDetail.comment_data.length; i++) {
        postDetail.comment_data[i]['user'] = (
          await getOtherUserInfo(postDetail.comment_data[i].OwnerId)
        ).user;
        // 只找HTML元素块
        const ContentObj = JSON.parse(postDetail.comment_data[i].CommentContent);
        for (let j = 0; j < ContentObj.length; j++) {
          if (ContentObj[j].type == 'HTML') {
            postDetail.comment_data[i]['HTMLContent'] = ContentObj[j].data;
            break;
          }
        }
        if (!postDetail.comment_data[i]['HTMLContent']) {
          postDetail.comment_data[i]['HTMLContent'] = '<strong>空白评论</strong>';
        }
        // 评论时间
        const commentDate = new Date(parseInt(postDetail.comment_data[i].CommentDate));
        postDetail.comment_data[i]['DateString'] = dateFormat('YYYY-mm-dd HH:MM', commentDate);
      }
      commentData.value = postDetail.comment_data;
      loading.value = false;
      notFound.value = false;
    } else {
      loading.value = false;
      notFound.value = true;
    }
  });
  const EditorOptions = reactive({
    modules: {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],

          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent

          [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],
          ['clean'],
          ['image'],
        ],
        handlers: {
          image: function (_value) {
            message.info('直接使用ctrl+v在文本框中粘贴你的图片即可');
          },
        },
      },
    },
    theme: 'snow',
    placeholder: '在这里输入你的评论，支持富文本。',
  });
  const quillEditor = ref();
  window['quill'] = quillEditor;
  const CommentContent = ref('');
  function doMakeComment() {
    sendComment(Role, {
      postId,
      Comment: JSON.stringify([
        {
          type: 'HTML',
          data: quillEditor.value.getHTML(),
        },
      ]),
    }).then((res) => {
      if (res.code == 200) {
        // 发送成功，直接刷新整个页面
        message.success('评论成功!');
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        message.error(res['map_message']);
      }
    });
  }
  function doMakeCommentAndReject() {
    requireRevise({
      postId,
      Comment: JSON.stringify([
        {
          type: 'HTML',
          data: quillEditor.value.getHTML(),
        },
      ]),
    }).then((res) => {
      if (res.code == 200) {
        // 发送成功，直接刷新整个页面
        message.success('驳回申请成功!');
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        message.error(res['map_message']);
      }
    });
  }
  function openReviseTab() {
    router.push({ name: 'post_revise', params: { id: postId } });
  }
  function doPassPostFDY() {
    passPostFDY(postId).then((res) => {
      if (res.code == 200) {
        message.success('通过申请成功!');
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        message.error(res['map_message']);
      }
    });
  }
  const showModalPass = ref(false);
  const forwardTarget = ref('');
  const passFormRules = {
    forwardTarget: {
      required: true,
      message: '秀米账号不能为空!',
      trigger: 'blur',
      validator() {
        const value = forwardTarget.value;
        if (!value) {
          return new Error('秀米账号不能为空!');
        }
        return true;
      },
    },
  };
  function getDetailError(data) {
    let ret = '';
    if (data.outOfLimit) {
      ret += '对方账号已满/';
    }
    if (data.userNotFound) {
      ret += '对方账号不存在/';
    }
    if (data.paperNotFound) {
      ret += '图文不存在/';
    }
    return ret;
  }
  function CopyPaperForwardNotion() {
    const forwardObj = JSON.parse(postData.value.TWForwardPaperInfo);
    const title = forwardObj.title;
    navigator.clipboard.writeText(PaperForwardNotion.replace('{{paperTitle}}', title));
    message.info('通知信息已成功复制到剪辑版，去微信粘贴吧~');
  }
  function copyToClipboard(textToCopy) {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
      // navigator clipboard api method'
      return navigator.clipboard.writeText(textToCopy);
    } else {
      // text area method
      let textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      // make the textarea out of viewport
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res1, rej1) => {
        // here the magic happens
        document.execCommand('copy') ? res1(123) : rej1();
        textArea.remove();
      });
    }
  }
  function doPassPostTW() {
    // 团委管理员和团委干事都是这里通过
    formRef.value.validate((errors) => {
      if (!errors) {
        message.info('正在转存, 请稍等片刻...');
        passPostTW({
          postId,
          forwardTarget: forwardTarget.value,
        }).then((res) => {
          if (res.code == 200) {
            showModalPass.value = false;
            message.success('成功通过!');
            setTimeout(() => {
              location.reload();
            }, 1000);
          } else if (res.code == 500 && res.data) {
            showModalPass.value = false;
            dialog.error({
              title: '通过失败',
              content: '转发文章失败，请查看详细信息: ' + getDetailError(res.data),
              positiveText: '确定',
              onPositiveClick: () => {
                if (res.data.outOfLimit) {
                  copyToClipboard(FullCapNotion).then(() => {
                    message.info('账号已满信息已复制到你的剪辑版，可以直接微信发送');
                  });
                }
              },
            });
          } else {
            dialog.error({
              title: '通过失败',
              content: '转发文章失败，信息: ' + res['map_message'],
              positiveText: '确定',
            });
          }
        });
      } else {
        message.error('请填写完整信息!');
      }
    });
  }
  const showModalArrange = ref(false);
  const TwMemberOptions: any = ref([]);
  const TwMemberSessionOptions: any = ref([]);
  const arrageMemberId = ref('');
  const arrangeMemberSessionId = ref('');
  getUserLists(JSON.stringify(['TwMember'])).then((res) => {
    if (res.code == 200) {
      for (let i = 0; i < res.data.length; i++) {
        TwMemberOptions.value.push({
          label: res.data[i].nickname,
          value: res.data[i]._id,
        });
      }
    } else {
      message.error('无法加载团委干事列表!');
    }
  });
  const twmemberFormRules = {
    TwMemberId: {
      required: true,
      message: '干事账号不能为空!',
      trigger: 'blur',
      validator() {
        const value = arrageMemberId.value;
        if (!value) {
          return new Error('干事账号不能为空!');
        }
        return true;
      },
    },
    TwMemberSessionId: {
      required: true,
      message: '干事秀米账号不能为空!',
      trigger: 'blur',
      validator() {
        const value = arrangeMemberSessionId.value;
        if (!value) {
          return new Error('干事秀米账号不能为空!');
        }
        return true;
      },
    },
  };
  function onTwMemberSelected() {
    TwMemberSessionOptions.value = [];
    getOtherUserSessions(arrageMemberId.value).then((res) => {
      if (res.code == 200) {
        for (let i = 0; i < res.data.length; i++) {
          const uaObj = JSON.parse(res.data[i].UserInfo);
          TwMemberSessionOptions.value.push({
            label: `${uaObj.user.nickname}(${res.data[i].XiumiUsername})`,
            value: res.data[i]._id,
          });
        }
      } else {
        message.error('获取该团委干事秀米账号失败！');
      }
    });
  }
  function doArrangeTwMember() {
    twArrangeTwMember({
      postId,
      TwMemberId: arrageMemberId.value,
      sessionId: arrangeMemberSessionId.value,
    }).then((res) => {
      if (res.code == 200) {
        showModalArrange.value = false;
        dialog.success({
          title: '转存成功',
          content: '转存成功，推送已转存至干事的秀米账号，请注意提醒对应干事审核！',
          positiveText: '确定',
          onPositiveClick: () => {
            location.reload();
          },
        });
      } else if (res.code == 500 && res.data) {
        showModalArrange.value = false;
        dialog.error({
          title: '通过失败',
          content: '转发文章失败，请查看详细信息: ' + getDetailError(res.data),
          positiveText: '确定',
        });
      } else {
        dialog.error({
          title: '通过失败',
          content: '转发文章失败，信息: ' + res['map_message'],
          positiveText: '确定',
        });
      }
    });
  }
  // 绑定图片上传接口
  function readyQuill() {
    BindQuillUploadImageInterface(message, quillEditor);
  }
</script>

<style scoped>
  .cardMargin {
    margin-top: 20px;
  }
  .commentDate {
    color: grey;
  }
  .commentHeader {
    font-weight: 500;
    font-size: 16px;
  }
  .commentMargin {
    margin-left: 30px;
  }
  .commentLimiter >>> img {
    max-width: 50%;
    box-shadow: 0px 0px 4px 3px #13131336;
  }
</style>
