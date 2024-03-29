import { useEffect, useContext, useState, SyntheticEvent } from 'react';
import { AppContext, AppContextType } from '../Context/AppContext';
import { Page } from '../Context/AppContext';
import { useParams, useNavigate } from 'react-router-dom';
import {
  addComment,
  deletePost,
  getPost,
  getUserInfo,
} from '../utilities/FirestoreHelpers';
import { Firestore } from '@firebase/firestore';
import UserInfoType, { PostType } from '../types/userInfoType';
import PostImage from '../components/Post/PostImage';
import '../styles/postpage.css';
import Avatar, { AvatarSize } from '../components/Avatar/Avatar';
import { Link } from 'react-router-dom';
import PostPageComments from '../components/PostPage/PostPageComments';
import PostLikeBar from '../components/Post/PostLikeBar';
import { doILikePost, toggleLikePost } from '../utilities/FirestoreHelpers';
import LikedBy from '../components/PostPage/LikedBy';
import AddComment from '../components/PostPage/AddComment';
import { useMediaQuery } from '../hooks/useMediaQuery';

const PostPage = (): JSX.Element => {
  const { userInfo, db, dispatch } = useContext(AppContext) as AppContextType;
  const params = useParams();

  const [post, setPost] = useState<PostType | null>(null);
  const [postUserInfo, setPostUserInfo] = useState<UserInfoType | null>(null);
  const [postLiked, setPostLiked] = useState<boolean>(false);
  const [comment, setComment] = useState<string>('');
  const [refreshPost, setRefreshPost] = useState<boolean>(false);
  const [isUser, setIsUser] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const isSmall = useMediaQuery('(max-width: 720px)');
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({ type: 'changePage', payload: Page.PostPage });
  }, [dispatch]);

  useEffect(() => {
    async function fetchPost() {
      const fetchedPost = await getPost(db as Firestore, params.pid as string);
      setPost(fetchedPost);
      setIsLoaded(true);
    }

    if (db != null) {
      fetchPost();
      setRefreshPost(false);
    }

    return () => {
      setIsLoaded(false);
    };
  }, [params, db, refreshPost]);

  useEffect(() => {
    async function fetchPostUserInfo() {
      const fetchedUserInfo = await getUserInfo(
        post?.uid as string,
        db as Firestore
      );
      setPostUserInfo(fetchedUserInfo);

      if (post != null) {
        const liked = await doILikePost(
          db as Firestore,
          post.id,
          userInfo?.userId as string
        );

        setPostLiked(liked);
      }
    }

    if (post != null) {
      fetchPostUserInfo();
    }
  }, [db, post, userInfo]);

  useEffect(() => {
    if (post?.uid === userInfo?.userId) {
      setIsUser(true);
    }
  }, [post, userInfo]);

  const likeThePost = (like: boolean) => {
    if (db != null && userInfo != null && post != null) {
      toggleLikePost(db, post.id, userInfo?.userId, like);
      setPostLiked(like);
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
    setRefreshPost(true);
  };

  const handleDelete = async () => {
    await deletePost(db as Firestore, post?.id as string);
    navigate('/profile', { replace: true });
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

  if (isLoaded) {
    return (
      <div className='post-page-wrapper'>
        <div className='post-page-container'>
          <div
            className={`post-page-post ${
              isSmall ? 'post-page-post--column' : ''
            }`}>
            <div className='post-page-post__image'>
              <PostImage imgUrl={post?.imgUrl ?? ''} />
            </div>
            <div
              className={`post-page-post__side-bar ${
                isSmall ? 'post-page-post__side-bar--column' : ''
              }`}>
              <div>
                <div className='side-bar__header'>
                  <div
                    className={`post-page-post__user-info ${
                      isSmall ? 'post-page-post__user-info--column' : ''
                    }`}>
                    <Avatar
                      profilePicSrc={postUserInfo?.userProfilePic ?? ''}
                      size={AvatarSize.Medium}
                      alt=''
                    />
                    <Link
                      className='link'
                      to={`/users/${postUserInfo?.userId}`}>
                      <h3 className='user-info__username'>
                        {postUserInfo?.userNickname}
                      </h3>
                    </Link>
                  </div>
                  {isUser ? (
                    <button
                      className='post-page-post__delete-button'
                      onClick={() => {
                        handleDelete();
                      }}>
                      Delete
                    </button>
                  ) : null}
                </div>
                {isSmall ? null : (
                  <PostPageComments comments={post?.comments ?? []} />
                )}
              </div>
              <div
                className={`side-bar__bottom ${
                  isSmall ? 'side-bar__bottom--column' : ''
                }`}>
                <PostLikeBar
                  likeThePost={likeThePost}
                  liked={postLiked}
                  handleCommentIconClick={handleCommentIconClick}
                />
                <LikedBy likes={post?.likes ?? []} />
                <AddComment
                  doFocus={focusComment}
                  value={comment}
                  handleValueChange={handleCommentChange}
                  submitComment={submitComment}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default PostPage;
