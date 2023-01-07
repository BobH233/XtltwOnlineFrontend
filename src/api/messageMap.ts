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
};
export function MapMessage(message: string) {
  if (MessageMap.hasOwnProperty(message)) {
    return MessageMap[message];
  } else {
    return message;
  }
}
