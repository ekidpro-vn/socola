import get from 'lodash.get';
import React, { useEffect } from 'react';
import { List } from 'react-content-loader';
import { useDispatch, useSelector } from 'react-redux';
import { getFeedsFromApi } from '../../../store/action';
import { FeedItem } from '../feed-item/feed-item';
import { FeedListProps } from './feed-list.type';

export const FeedList: React.FC<FeedListProps> = ({ moduleId, channelId, recordId }) => {
  const dispatch = useDispatch();
  const feeds = useSelector((state) => get(state, 'feeds'));

  useEffect(() => {
    dispatch(getFeedsFromApi(moduleId, recordId, channelId));
  }, [moduleId, channelId, recordId, dispatch]);

  if (!feeds) {
    return (
      <div className="mt-10">
        <List />
      </div>
    );
  }

  if (feeds.length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      {feeds.map((item) => (
        <FeedItem item={item} key={item.ID} />
      ))}
    </div>
  );
};
