import { useContext, useEffect, useState } from 'react';
import { AppContext, AppContextType } from '../../Context/AppContext';
import UserInfoType, { PostType } from '../../types/userInfoType';
import { getUserInfo } from '../../utilities/FirestoreHelpers';
import PostHeader from './PostHeader';
import PostImage from './PostImage';
import PostLikeBar from './PostLikeBar';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [userInfo, setUserInfo] = useState<UserInfoType>();
  const { db } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    async function fetchUserInfo() {
      if (db != null) {
        const uInfo = await getUserInfo(post.uid, db);

        setUserInfo(uInfo);
      }
    }

    fetchUserInfo();
  }, [db]);

  return (
    <article className='post'>
      <PostHeader
        userName={userInfo?.userNickname ?? ''}
        profilePicUrl={userInfo?.userProfilePic ?? ''}
      />
      <PostImage imgUrl={post.imgUrl} />
      <PostLikeBar />
    </article>
  );
};

export default Post;
