import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProps, setScrollTop } from '../store/action';
import { initialProps } from '../store/reducer';
import { SocolaProps } from '../types/socola';
import { getScrollTop } from '../utils/helper';
import { Editor } from './components/editor';
import { FeedList } from './components/feed-list/feed-list';

export const SocolaComponent: React.FC<SocolaProps> = (props) => {
  const dispatch = useDispatch();
  const socolaRef = useRef<HTMLDivElement>(null);
  const scrollTop = useSelector(getScrollTop);
  const [errorProps, setErrorProps] = useState<string>('');

  useEffect(() => {
    if (!props.token) {
      setErrorProps('Socola has no token!');
    }
    if (!props.moduleId) {
      setErrorProps('Socola has no moduleId!');
    }
    if (!props.secretKey) {
      setErrorProps('Socola has no secretKey!');
    }
    if (!props.clientId) {
      setErrorProps('Socola has no clientId!');
    }
  }, [props, dispatch]);

  useEffect(() => {
    if (scrollTop) {
      socolaRef.current.scrollIntoView();
      dispatch(setScrollTop(false));
    }
  }, [scrollTop, dispatch]);

  useEffect(() => {
    dispatch(setProps({ ...props }));
    return () => {
      dispatch(setProps(initialProps));
    };
  }, [props, dispatch]);

  return (
    <div ref={socolaRef}>
      {!props.readOnly && <Editor />}
      {errorProps ? (
        <div className="my-4 flex justify-end">
          <span className="block text-red-500">Error: {errorProps}</span>
        </div>
      ) : (
        <div className="sm:mx-2">
          <FeedList />
        </div>
      )}
    </div>
  );
};
