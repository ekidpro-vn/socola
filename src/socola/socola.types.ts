export interface OptionProps {
  value: string | number;
  label: string;
}

export interface UserInfo {
  id: number;
  uid: number;
  username: string | null;
  avatar: string | null;
  fullname: string | null;
  first_name: string | null;
  last_name: string | null;
  gender: 'MALE' | 'FEMALE';
  phone: string | null;
  phone2: string | null;
  email: string | null;
  type: string | null;
  status?: string | number | null;
  birthday?: number | null;
}

export interface SocolaProps {
  moduleId: string;
  socolaToken: string;
  recordId?: string;
  channelId?: string;
  statusOption?: OptionProps[];
  showDate?: boolean;
  showStatus?: boolean;
  readOnly?: boolean;
  renderType?: 'minimum' | 'social' | 'note';
  infoUser?: UserInfo;
}
