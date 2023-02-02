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
  'Delete post successfully!': '成功删除申请!',
  'This post could not be deleted!': '这篇申请不能被删除!',
  success: '成功',
  'Delete successfully!': '删除成功!',
  'Successfully update post status and paperId!': '成功更新申请和图文id',
  'Invalid sessionId, try manual setting sessionId!': '非法的秀米会话，请尝试手动指定秀米会话',
  'Could not find the post!': '无法找到对应的帖子',
  'Empty params!': '缺少参数',
  'Could not find valid session for tw! Update your XiumiSessions!':
    '无法找到合适的公用账号秀米会话，请在秀米账号绑定中登录公用账号!',
  'Forward paper failed, see reasons.': '转存文章失败，详情见错误信息',
  'Successfully pass the post!': '成功通过了文章',
  'Could not find valid XiumiSession!': '无法找到有效的秀米账号',
  'Cannot find this user!': '无法找到这个用户',
  'Cannot find this credential!': '无法找到这个凭据，请选择正确的登录方式',
  'No valid Xiumi Session. Try update you xiumi sessions!':
    '没有合适的秀米账号绑定，请更新秀米账号绑定重试！',
  'Invalid SessionId or expired session.': '非法的Id',
  'Username is conflicted': '用户名冲突',
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
