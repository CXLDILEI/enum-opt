/**
 * 对话框业务类型
 */
export enum ModalType {
  // 新增
  Add,
  // 编辑
  Edit,
  // 详情
  Detail,
  // 完善
  Perfect,
}

/**
 * 微应用全局操作类型
 */
export enum GlobalActions {
  /**
   * 无操作
   */
  None,
  /**
   * 登录
   */
  SignIn,
  /**
   * 退出登录
   */
  SignOut,
  /**
   * 设置菜单数据
   */
  InitMenu,
  /**
   * 设置reuseTab
   */
  SetReuseTab,
}
