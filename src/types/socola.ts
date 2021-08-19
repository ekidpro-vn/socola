export interface OptionProps {
  value: string | number;
  label: string;
}

export interface SocolaProps {
  moduleId: string;
  socolaToken: string; // socolaToken => token
  secretKey: string;
  recordId?: string; // => record
  channelId?: string; // => channel
  statusOption?: OptionProps[]; // status tu ben ngoai truyen vao
  showDate?: boolean; // hien thi component chon date
  showStatus?: boolean; // hien thi milestone
  readOnly?: boolean; // ko cho edit feed, ko hien thi text area

  renderType?: 'minimum' | 'social' | 'note'; // meo hieu la cai gi, dang lam nhu con cu

  userInfo?: {
    id: number;
    type: string;
  };

  apiDomain?: string; // ko phai apiDomain -> domain

  onError?: (e: string) => void;
  onShowImageFeed?: (src: string, index: number) => void;
}
