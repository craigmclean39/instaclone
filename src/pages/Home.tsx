import { useEffect, useContext, useState } from 'react';
import {
  AppContextActionType,
  AppContext,
  AppContextType,
} from '../Context/AppContext';
import { Page } from '../Context/AppContext';
import Post from '../components/Post/Post';
import { getRecentPostsFromFollowing } from '../utilities/FirestoreHelpers';
import { Firestore } from '@firebase/firestore';
import { PostType } from '../types/userInfoType';
import { useMediaQuery } from '../hooks/useMediaQuery';

export interface HomeProps {
  dispatch(o: AppContextActionType): void;
}

const Home: React.FC<HomeProps> = ({ dispatch }): JSX.Element => {
  const { userInfo, db } = useContext(AppContext) as AppContextType;
  const [posts, setPosts] = useState<PostType[]>([]);
  const [mappedPosts, setMappedPosts] = useState<JSX.Element[]>([]);

  const movePostsToCenter = useMediaQuery('(max-width: 924px)');

  useEffect(() => {
    dispatch({ type: 'changePage', payload: Page.HomePage });
  }, [dispatch]);

  useEffect(() => {
    async function fetchPosts() {
      if (db != null && userInfo != null) {
        const followingPosts = await getRecentPostsFromFollowing(
          db as Firestore,
          userInfo?.following as string[]
        );

        if (followingPosts != undefined) {
          setPosts(followingPosts);

          const postElements = followingPosts.map((post) => {
            return <Post post={post} />;
          });

          setMappedPosts(postElements);
        }
      }
    }

    fetchPosts();
  }, [db, userInfo]);

  return (
    <div className='post-wrapper'>
      <div
        className={`post-container ${movePostsToCenter ? 'center-align' : ''}`}>
        {mappedPosts}
      </div>
    </div>
  );
};

export default Home;
