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
      if (db != null && userInfo != null) {
        const ref = collection(db as Firestore, 'posts');
        const q = query(ref, where('uid', '==', userInfo.userId));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.docs);

        const userPosts: PostType[] = [];
        querySnapshot.forEach((doc) => {
          userPosts.push(doc.data() as PostType);
        });

        setPosts(userPosts);

        console.log(userPosts);
      }
    }

    fetchPosts();
  }, [userInfo, db]);

  const isSmall = useMediaQuery('(max-width: 720px)');

  const pi = posts.map((post) => {
    return (
      <img
        className='profile__post'
        src={post.imgUrl}
        alt=''
        key={post.id}></img>
    );
  });

  return (
    <div className='profile-container'>
      <div className='profile-wrapper'>
        <div className={isSmall ? 'profile--small' : 'profile'}>
          <ProfileHeader numPosts={posts.length} />
          {isSmall ? null : <div className='profile__decorative-line'></div>}
        </div>
        {pi}
      </div>
    </div>
  );
};

export default Profile;
