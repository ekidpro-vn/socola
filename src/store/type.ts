import { FeedType } from '../types/feed';
import { OptionProps } from '../types/socola';

export interface UploadImage {
  base64Url: string | ArrayBuffer;
  file?: File;
  id: string;
}

export interface SetProps {
  moduleId?: string;
  recordId?: string;
  channelId?: string;
  socolaToken?: string;
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

export interface PaginationFeed {
  totalItems: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface State {
  feeds: FeedType[] | null;
  error?: string;
  loading?: boolean;
  uploadImages: UploadImage[];
  props: SetProps;
  paginationFeed: PaginationFeed;
  scrollTop?: boolean;
}
