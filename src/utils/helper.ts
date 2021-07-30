import dayjs from 'dayjs';
import { OptionsType } from 'react-select';
import { OptionProps } from 'types/socola';
import { State } from '../store/type';

const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

export const base64ToBlob = (base64: string) => {
  const block = base64.split(';');
  const contentType = block[0].split(':')[1];
  const realData = block[1].split(',')[1];
  return b64toBlob(realData, contentType);
};

export const getProps = (state: State) => {
  return state.props;
};

export const getPaginationFeed = (state: State) => {
  return state.paginationFeed;
};

export const getFeeds = (state: State) => {
  return state.feeds;
};

export const getUploadImages = (state: State) => {
  return state.uploadImages;
};

export const getScrollTop = (state: State) => {
  return state.scrollTop;
};

export const getDisplayTime = (timestamp: number) => {
  // milisecond
  const today = dayjs().startOf('day').valueOf();
  const day = dayjs(timestamp).format('DD/MM/YYYY');
  const hour = dayjs(timestamp).format('HH:mm');
  if (timestamp > today) {
    return `Today at ${hour}`;
  }
  if (timestamp > today - 86400000) {
    return `Yesterday at ${hour}`;
  }
  return `${day} at ${hour}`;
};

const isSingleElement = (data: OptionsType<OptionProps> | OptionProps | null): data is OptionProps => {
  return !Array.isArray(data);
};

export const getDataDropdown = (data: OptionsType<OptionProps> | OptionProps | null): OptionProps[] => {
  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data;
  }

  if (isSingleElement(data)) {
    return [data];
  }

  return [];
};
