import { ModalType, GlobalActions } from '../enum'
/**
* 对话框业务类型
*/
export const modalTypeOptions = [
  {
    label: '新增',
    value: ModalType.Add,
  },
  {
    label: '编辑',
    value: ModalType.Edit,
  },
  {
    label: '详情',
    value: ModalType.Detail,
  },
  {
    label: '完善',
    value: ModalType.Perfect,
  },
]
/**
* 微应用全局操作类型
*/
export const globalActionsOptions = [
  {
    label: '无操作',
    value: GlobalActions.None,
  },
  {
    label: '登录',
    value: GlobalActions.SignIn,
  },
  {
    label: '退出登录',
    value: GlobalActions.SignOut,
  },
  {
    label: '设置菜单数据',
    value: GlobalActions.InitMenu,
  },
  {
    label: '设置reuseTab',
    value: GlobalActions.SetReuseTab,
  },
]


