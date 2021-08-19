export interface OptionProps {
  value: string | number;
  label: string;
}

export interface SocolaProps {
  moduleId: string;
  token: string;
  secretKey: string;
  recordId?: string; // => record
  channelId?: string; // => channel
  statusOption?: OptionProps[]; // status tu ben ngoai truyen vao
  showDate?: boolean; // hien thi component chon date (milestone)
  showStatus?: boolean; // hien thi dropdown status
  readOnly?: boolean; // ko cho edit feed, ko hien thi text area
  renderType?: 'minimum' | 'social'; // hinh thuc hien thi feed
  cId: string; // la cai gi do o phia api can de hien thi avatar (vi du cms ekidpro thi cid='ekidpro')

  userInfo?: {
    id: number;
    type: string;
  };

  domain?: string;

  onError?: (e: string, type: 'get' | 'put' | 'post' | 'delete') => void;
  onShowImageFeed?: (src: string, index: number) => void;
}
