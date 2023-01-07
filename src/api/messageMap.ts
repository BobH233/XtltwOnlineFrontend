// 将服务器的信息翻译中文
const MessageMap = {
  'Login successfully! welcome!': '登录成功，即将跳转!',
  'Username or password is wrong!': '账号或密码错误!',
  'invalid api router.': '非法api路由!',
  'Logout successfully!': '成功登出账号!',
  'Query successfully!': '查询成功!',
  "You don't have permission to call this api.": '你无权调用本API',
  'Successfully change the password': '修改密码成功!',
  'Old password is wrong!': '原密码错误!',
  'Successfully delete the session!': '成功删除会话!',
  'No matching sessionId!': '没有找到对应的会话id!',
  'Successfully delete all sessions!': '成功下线所有的会话!',
};
export function MapMessage(message: string) {
  if (MessageMap.hasOwnProperty(message)) {
    return MessageMap[message];
  } else if (message.indexOf('internal code error.') != -1) {
    return message.replace('internal code error.', '内部代码错误');
  } else {
    return message;
  }
}
