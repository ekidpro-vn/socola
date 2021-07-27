export interface OptionProps {
  value: string | number;
  label: string;
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
  userInfo?: {
    id: number;
    role: string;
  };
}
