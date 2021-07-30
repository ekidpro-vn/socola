import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProps, setScrollTop } from '../store/action';
import { SocolaProps } from '../types/socola';
import { getScrollTop } from '../utils/helper';
import { FeedList } from './components/feed-list/feed-list';
import { TextArea } from './components/text-area';

export const Socola: React.FC<SocolaProps> = (props) => {
  const dispatch = useDispatch();
  const socolaRef = useRef<HTMLDivElement>(null);
  const scrollTop = useSelector(getScrollTop);

  useEffect(() => {
    if (scrollTop) {
      socolaRef.current.scrollIntoView();
      dispatch(setScrollTop(false));
    }
  }, [scrollTop, dispatch]);

  useEffect(() => {
    dispatch(setProps({ ...props }));
  }, [dispatch, props]);

  return (
    <div ref={socolaRef}>
      {!props.readOnly && <TextArea />}
      <div className="px-2">
        <FeedList />
      </div>
    </div>
  );
};
