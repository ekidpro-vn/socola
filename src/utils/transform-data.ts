import get from 'lodash.get';
import { FeedType } from 'types/feed';

export const getTransformFeeds = (feeds: Record<string, unknown>) => {
  if (feeds && Array.isArray(feeds) && feeds.length > 0) {
    const transformFeeds: FeedType[] = feeds.map((item) => {
      return {
        ChannelID: get(item, 'ChannelID'),
        FeedKey: get(item, 'FeedKey'),
        CommentCount: get(item, 'CommentCount'),
        Comments: get(item, 'Comments'),
        ID: get(item, 'ID'),
        LikesCount: get(item, 'LikesCount'),
        UserFullName: get(item, 'UserFullName'),
        ModuleID: get(item, 'ModuleID'),
        PostedAt: get(item, 'PostedAt'),
        RecordID: get(item, 'RecordID'),
        UserID: get(item, 'UserID'),
        isLike: get(item, 'isLike'),
        isPublic: get(item, 'isPublic'),
        isYouLiked: get(item, 'isYouLiked'),
        Content: {
          Content: get(item, 'Content.Content'),
          date: get(item, 'Content.date'),
          status: get(item, 'Content.status'),
          note: get(item, 'Content.note'),
          Image: get(item, 'Content.Image'),
        },
      };
    });
    return transformFeeds;
  }

  return [];
};

export const getTransformFeed = (feed: any) => {
  if (feed && typeof feed === 'object') {
    const transformFeeds: FeedType = {
      ChannelID: get(feed, 'ChannelID'),
      FeedKey: get(feed, 'FeedKey'),
      CommentCount: get(feed, 'CommentCount'),
      Comments: get(feed, 'Comments'),
      ID: get(feed, 'ID'),
      LikesCount: get(feed, 'LikesCount'),
      UserFullName: get(feed, 'UserFullName'),
      ModuleID: get(feed, 'ModuleID'),
      PostedAt: get(feed, 'PostedAt'),
      RecordID: get(feed, 'RecordID'),
      UserID: get(feed, 'UserID'),
      isLike: get(feed, 'isLike'),
      isPublic: get(feed, 'isPublic'),
      isYouLiked: get(feed, 'isYouLiked'),
      Content: {
        Content: get(feed, 'Content.Content'),
        date: get(feed, 'Content.date'),
        status: get(feed, 'Content.status'),
        note: get(feed, 'Content.note'),
        Image: get(feed, 'Content.Image'),
      },
    };
    return transformFeeds;
  }

  return null;
};
