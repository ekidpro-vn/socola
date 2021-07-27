import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setProps } from '../store/action';
import { SocolaProps } from '../types/socola';
import { FeedList } from './components/feed-list/feed-list';
import { TextArea } from './components/text-area';

// export const source = axios.CancelToken.source();

export const Socola: React.FC<SocolaProps> = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setProps({ ...props }));
  }, [dispatch, props]);

  return (
    <div>
      {!props.readOnly && <TextArea />}
      <div className="px-2">
        <FeedList />
      </div>
    </div>
  );
};
