import { OptionProps } from '../../../socola/socola.types';

export interface TextAreaProps {
  channelId: string;
  showDate: boolean;
  showStatus: boolean;
  statusOption: OptionProps[];
  recordId?: string;
  moduleId: string;
}
