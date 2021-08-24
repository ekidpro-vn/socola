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
  clientId?: string;
  channelId?: string;
  token?: string;
  statusOption?: OptionProps[];
  showDate?: boolean;
  showStatus?: boolean;
  readOnly?: boolean;
  renderType?: 'minimum' | 'social';
  userInfo?: {
    id: number;
    type: string;
  };
  secretKey?: string;
  onError?: (e: string, type: 'get' | 'put' | 'post' | 'delete') => void;
  onShowImageFeed?: (src: string, index: number) => void;
  numberOfSeeMoreReplyComment?: number;
}

export interface PaginationFeed {
  totalItems: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface State {
  feeds: FeedType[] | null | undefined;
  error?: string;
  loading?: boolean;
  uploadImages: UploadImage[];
  props: SetProps;
  paginationFeed: PaginationFeed;
  scrollTop?: boolean;
}
