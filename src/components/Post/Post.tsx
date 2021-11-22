import { useContext, useEffect, useState } from 'react';
import { AppContext, AppContextType } from '../../Context/AppContext';
import UserInfoType, { PostType } from '../../types/userInfoType';
import {
  getUserInfo,
  toggleLikePost,
  doILikePost,
  followUser,
} from '../../utilities/FirestoreHelpers';
import PostHeader from './PostHeader';
import PostImage from './PostImage';
import PostLikeBar from './PostLikeBar';
import PostComments from './PostComments';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [postUserInfo, setPostUserInfo] = useState<UserInfoType>();
  const { db, userInfo, dispatch } = useContext(AppContext) as AppContextType;
  const [postLiked, setPostLiked] = useState(false);
  const [userFollowed, setUserFollowed] = useState(false);

  useEffect(() => {
    async function fetchUserInfo() {
      if (db != null && userInfo != null) {
        const liked = await doILikePost(db, post.id, userInfo?.userId);

        setPostLiked(liked);
      }
    }

    fetchUserInfo();
  }, [db]);

  useEffect(() => {
    async function isPostLiked() {
      if (db != null) {
        const uInfo = await getUserInfo(post.uid, db);

        setPostUserInfo(uInfo);
      }
    }

    isPostLiked();
  }, [db]);

  useEffect(() => {
    if (userInfo?.following.includes(post.uid)) {
      setUserFollowed(true);
    } else {
      setUserFollowed(false);
    }
  }, [userInfo]);

  const likeThePost = (like: boolean) => {
    if (db != null && userInfo != null) {
      toggleLikePost(db, post.id, userInfo?.userId, like);
      setPostLiked(like);
    }
  };

  const followTheUser = (follow: boolean) => {
    if (db != null && userInfo != null) {
      followUser(db, post.uid, userInfo?.userId, follow);
      setUserFollowed(follow);
      dispatch({ type: 'reloadUserInfo', payload: true });
    }
  };

  return (
    <article className='post'>
      <PostHeader
        userName={postUserInfo?.userNickname ?? ''}
        profilePicUrl={postUserInfo?.userProfilePic ?? ''}
        userFollowed={userFollowed}
        followTheUser={followTheUser}
      />
      <PostImage imgUrl={post.imgUrl} />
      <PostLikeBar likeThePost={likeThePost} liked={postLiked} />
      <PostComments comments={post.comments} />
    </article>
  );
};

export default Post;
