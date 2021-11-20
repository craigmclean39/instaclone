import { FieldValue } from '@firebase/firestore';

export default interface UserInfoType {
  userId: string;
  userName: string;
  userProfilePic: string;
  userNickname: string;
  following: string[];
  followers: string[];
  description: string;
}

export interface CommentType {
  content: string;
  uid: string;
}

export interface PostType {
  id: string;
  uid: string;
  imgUrl: string;
  comments: CommentType[];
  likes: string[];
  timestamp: FieldValue;
}
