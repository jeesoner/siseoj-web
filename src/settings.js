module.exports = {
  /**
   * @description 网站标题
   */
  title: 'Niu Code',
  /**
   * @description 是否显示 tagsView
   */
  tagsView: true,
  /**
   * @description 固定头部
   */
  fixedHeader: true,
  /**
   * @description 记住密码状态下的token在Cookie中存储的天数，默认7天
   */
  tokenCookieExpires: 7,
  /**
   * @description 记住密码状态下的密码在Cookie中存储的天数，默认7天
   */
  passCookieExpires: 7,
  /**
   * @description token key
   */
  tokenKey: 'NIUCODE-TOKEN',
  /**
   * @description userInfo key
   */
  userKey: 'sakdnmfl123u5p9',
  /**
   * @description storage key
   */
  storageKey: {
    problemCode: 'niu_code_problem'
  },
  /**
   * @description 请求超时时间，毫秒（默认2分钟）
   */
  timeout: 1200000,
  /**
   * @description 是否显示logo
   */
  sidebarLogo: true,
  /**
   * 是否显示设置的底部信息
   */
  showFooter: true,
  /**
   * 底部文字，支持html语法
   */
  footerTxt: '© 2021 Cijee <a href="http://www.apache.org/licenses/LICENSE-2.0" target="_blank">Apache License 2.0</a>',
  /**
   * 备案号
   */
  caseNumber: ''
}
