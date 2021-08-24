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
  clientId: string; // client Id

  userInfo?: {
    id: number;
    type: string;
  };

  domain?: string;

  onError?: (e: string, type: 'get' | 'put' | 'post' | 'delete') => void;
  onShowImageFeed?: (src: string, index: number) => void;
  numberOfSeeMoreReplyComment?: number; // so luong tra loi binh luan xem them muon hien thi - mac dinh 5
}
