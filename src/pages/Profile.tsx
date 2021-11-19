import { useContext, useEffect, useState } from 'react';
import {
  AppContext,
  AppContextActionType,
  AppContextType,
} from '../Context/AppContext';
import { Page } from '../Context/AppContext';
import '../styles/profile.css';
import ProfileHeader from '../components/Profile/ProfileHeader';
import { useMediaQuery } from '../hooks/useMediaQuery';
import {
  collection,
  getDocs,
  query,
  where,
  Firestore,
} from '@firebase/firestore';
import { PostType } from '../types/userInfoType';
import ProfilePosts from '../components/Profile/ProfilePosts';
import { getUsersPosts } from '../utilities/FirestoreHelpers';

export interface ProfileProps {
  dispatch(o: AppContextActionType): void;
}

const Profile: React.FC<ProfileProps> = ({ dispatch }): JSX.Element => {
  const { userInfo, db } = useContext(AppContext) as AppContextType;

  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    dispatch({ type: 'changePage', payload: Page.ProfilePage });
  }, [dispatch]);

  useEffect(() => {
    async function fetchPosts() {
      if (userInfo != null && db != null) {
        const userPosts = await getUsersPosts(
          db as Firestore,
          userInfo?.userId as string
        );

        setPosts(userPosts);
      }
    }

    fetchPosts();
  }, [userInfo, db]);

  const isSmall = useMediaQuery('(max-width: 720px)');

  return (
    <div className='profile-container'>
      <div className='profile-wrapper'>
        <div className={isSmall ? 'profile--small' : 'profile'}>
          <ProfileHeader numPosts={posts.length} />
          {isSmall ? null : <div className='profile__decorative-line'></div>}
          <ProfilePosts posts={posts} isSmall={isSmall} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
