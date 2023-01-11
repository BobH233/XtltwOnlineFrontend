<template>
  <div>
    <n-card :bordered="false" title="生物验证">
      最前沿的web技术，绑定后你可以不使用密码登录，而是使用你的指纹，FaceID，电脑密码，甚至是实体NFC密匙登录。
    </n-card>
    <n-card :bordered="false" class="mt-4 proCard">
      <BasicTable
        :columns="columns"
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
      >
        <template #tableTitle>
          <n-space>
            <n-button type="primary" @click="doAddNewSession">
              <template #icon>
                <n-icon>
                  <UserAddOutlined />
                </n-icon>
              </template>
              新建生物验证
            </n-button>
            <n-input v-model:value="newLabelName" placeholder="标签" />
          </n-space>
        </template>
        <template #action>
          <TableAction />
        </template>
      </BasicTable>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
  import {
    fido2GetRegOptions,
    fido2Register,
    fido2GetLoginOptions,
    fido2Login,
    fido2GetCredentials,
    fido2DeleteCredential,
  } from '@/api/user/user';
  import { reactive, h, ref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { columns } from './columns';
  import { useDialog, useMessage } from 'naive-ui';
  import { UserAddOutlined } from '@vicons/antd';
import { _arrayBufferToBase64, _base64ToArrayBuffer } from '@/utils';
  // const base64buffer = require('base64-arraybuffer');
  const dialog = useDialog();
  const message = useMessage();
  const actionRef = ref<any>();
  const newLabelName = ref('');
  const loadDataTable = async (_res: any) => {
    // 载入表格数据的函数，res表示页数和每页个数
    try {
      let rawTableData = await fido2GetCredentials();
      return {
        page: 1,
        pageSize: rawTableData.data.length,
        pageCount: 1,
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
  
  async function doAddNewSession() {
    if (!navigator.credentials) {
      dialog.error({
        title: '错误',
        content: '当前浏览器或设备不支持生物验证',
        positiveText: '确定',
      });
      return;
    }
    const regOptionsRes = await fido2GetRegOptions();
    let regOptions = regOptionsRes.regOptions;
    regOptions.challenge = _base64ToArrayBuffer(regOptions.challenge);
    regOptions.user.id = _base64ToArrayBuffer(regOptions.user.id);
    let label = newLabelName.value || '未命名';
    navigator.credentials.create({ publicKey: regOptions }).then((credential: any) => {
      const passableCredential = {
        id: credential?.id,
        rawId: _arrayBufferToBase64(credential.rawId),
        response: {
          clientDataJSON: _arrayBufferToBase64(credential.response.clientDataJSON),
          attestationObject: _arrayBufferToBase64(credential.response.attestationObject),
        },
      };
      fido2Register({
        label,
        regParam: JSON.stringify(passableCredential),
      }).then((res) => {
        if (res.code == 200) {
          message.success('添加成功!');
          setTimeout(() => {
            actionRef.value.reload();
          }, 1000);
        } else {
          message.error(res['map_message']);
        }
      });
    });
  }
  async function test() {
    const loginOptionsRes = await fido2GetLoginOptions('TZB1');
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
        username: 'TZB1',
        loginParam: JSON.stringify(passableCredential),
      }).then((res) => {
        console.log(res);
      });
    });
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
            label: '删除',
            onClick: () => {
              fido2DeleteCredential(record._id).then((res) => {
                if (res.code == 200) {
                  message.success('成功删除');
                  actionRef.value.reload();
                } else {
                  message.error(res['map_message']);
                }
              });
            },
            ifShow: () => {
              return true;
            },
          },
        ],
      });
    },
  });
</script>
