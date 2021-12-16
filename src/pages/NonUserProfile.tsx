import { useContext, useEffect, useState } from 'react';
import { AppContext, AppContextType } from '../Context/AppContext';
import { Page } from '../Context/AppContext';
import '../styles/profile.css';
import ProfileHeader from '../components/Profile/ProfileHeader';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Firestore } from '@firebase/firestore';
import { PostType } from '../types/userInfoType';
import ProfilePosts from '../components/Profile/ProfilePosts';
import { getUsersPosts } from '../utilities/FirestoreHelpers';
import { useParams } from 'react-router-dom';

const NonUserProfile: React.FC = (): JSX.Element => {
  const { userInfo, db, dispatch } = useContext(AppContext) as AppContextType;

  const [posts, setPosts] = useState<PostType[]>([]);

  const params = useParams();

  useEffect(() => {
    dispatch({ type: 'changePage', payload: Page.NonUserProfilePage });
  }, [dispatch]);

  useEffect(() => {
    async function fetchPosts() {
      if (userInfo != null && db != null) {
        const userPosts = await getUsersPosts(
          db as Firestore,
          params.uid as string
        );

        setPosts(userPosts);
      }
    }

    fetchPosts();
  }, [userInfo, db, params.uid]);

  const isSmall = useMediaQuery('(max-width: 720px)');

  return (
    <div className='profile-container'>
      <div className='profile-wrapper'>
        <div className={isSmall ? 'profile--small' : 'profile'}>
          <ProfileHeader
            numPosts={posts.length}
            isUser={false}
            postUserId={params.uid ?? ''}
            handleOpenFollowersModal={() => {
              /* */
            }}
            handleOpenFollowingModal={() => {
              /* */
            }}
            handleChangeProfilePic={async () => {
              /* */
            }}
          />
          {isSmall ? null : <div className='profile__decorative-line'></div>}
          <ProfilePosts posts={posts} isSmall={isSmall} isUser={false} />
        </div>
      </div>
    </div>
  );
};

export default NonUserProfile;
