export interface SubFeedType {
  ID: number;
  CommentKey: string;
  FeedID: number;
  ClientID: string;
  UserID: string;
  UserFullName: string;
  Comment: string;
  LikesCount: number;
  PostedAt: number;
  IP: string;
  isYouLiked: false;
}

export interface FeedType {
  ChannelID: string | null;
  ClientID: string;
  CommentCount: number;
  Comments: Record<string, SubFeedType> | [];
  Content: {
    Content: string;
    date: string;
    status: string;
    note: string | null;
    Image: string[];
  };
  ConvoID: string;
  Department: string;
  DeptID: number;
  FeedKey: string;
  ID: number;
  IP: string;
  LastUpdated: number;
  LikesCount: number;
  Location: string;
  ModuleID: string | null;
  PostedAt: number;
  Rating: null;
  RecordID: string | null;
  RecordTitle: null;
  Status: null;
  ToUserID: string;
  TypeID: number;
  UserFullName: string;
  UserID: string;
  isDeleted: number;
  isLike: number;
  isPublic: number;
  isYouLiked: false;
}
