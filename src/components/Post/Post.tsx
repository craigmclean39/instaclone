import { SyntheticEvent, useContext, useEffect, useState } from 'react';
import { AppContext, AppContextType } from '../../Context/AppContext';
import UserInfoType, { PostType } from '../../types/userInfoType';
import {
  getUserInfo,
  toggleLikePost,
  doILikePost,
  followUser,
  addComment,
} from '../../utilities/FirestoreHelpers';
import PostHeader from './PostHeader';
import PostImage from './PostImage';
import PostLikeBar from './PostLikeBar';
import PostComments from './PostComments';
import { Link } from 'react-router-dom';
import AddComment from '../PostPage/AddComment';
import { Firestore } from '@firebase/firestore';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [postUserInfo, setPostUserInfo] = useState<UserInfoType>();
  const { db, userInfo, dispatch } = useContext(AppContext) as AppContextType;
  const [postLiked, setPostLiked] = useState(false);
  const [userFollowed, setUserFollowed] = useState(false);
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    async function fetchUserInfo() {
      if (db != null && userInfo != null) {
        const liked = await doILikePost(db, post.id, userInfo?.userId);

        setPostLiked(liked);
      }
    }

    fetchUserInfo();
  }, [db, post.id, userInfo]);

  useEffect(() => {
    async function isPostLiked() {
      if (db != null) {
        const uInfo = await getUserInfo(post.uid, db);

        if (uInfo != null) {
          setPostUserInfo(uInfo);
        }
      }
    }

    isPostLiked();
  }, [db, post.uid]);

  useEffect(() => {
    if (userInfo?.following.includes(post.uid)) {
      setUserFollowed(true);
    } else {
      setUserFollowed(false);
    }
  }, [userInfo, post.uid]);

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

  const handleCommentChange = (e: SyntheticEvent) => {
    //
    const target = e.target as HTMLInputElement;
    setComment(target.value);
  };

  const submitComment = async (e: SyntheticEvent, content: string) => {
    e.preventDefault();
    await addComment(
      db as Firestore,
      post?.id as string,
      comment,
      userInfo?.userId as string
    );
    setComment('');
  };

  const [focusComment, setFocusComment] = useState(false);
  const [didFocus, setDidFocus] = useState(false);

  const handleCommentIconClick = () => {
    setFocusComment(true);
    setDidFocus(true);
  };

  useEffect(() => {
    if (didFocus) {
      setFocusComment(false);
      setDidFocus(false);
    }
  }, [didFocus]);

  return (
    <article className='post'>
      <PostHeader
        userName={postUserInfo?.userNickname ?? ''}
        profilePicUrl={postUserInfo?.userProfilePic ?? ''}
        userFollowed={userFollowed}
        followTheUser={followTheUser}
        userId={postUserInfo?.userId ?? ''}
      />
      <Link to={`/posts/${post.id}`}>
        <PostImage imgUrl={post.imgUrl} />
      </Link>
      <PostLikeBar
        likeThePost={likeThePost}
        liked={postLiked}
        handleCommentIconClick={handleCommentIconClick}
      />
      <PostComments comments={post.comments} />
      <AddComment
        doFocus={focusComment}
        value={comment}
        handleValueChange={handleCommentChange}
        submitComment={submitComment}
      />
    </article>
  );
};

export default Post;
