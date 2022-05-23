export interface IPageObjectType {
  component: string;
  url?: string;
  answer?: string;
  moveToPage?: string;
}

export interface IState {
  merchantList: string[];
  themeList: string[];
  pageList: string[];
  merchantValue: string;
  themeValue: string;
  pageValue: string;
}

export interface IAction {
  type: string;
  payload: any;
}

export interface IItemList {
  prefix: string;
  name: string;
  suffix: string;
}
