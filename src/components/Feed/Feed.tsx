import { useState, useEffect } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import UserInfoType, { PostType } from '../../types/userInfoType';
import {
  getRecentPostsFromFollowing,
  getRecentPostsFromAll,
} from '../../utilities/FirestoreHelpers';
import Post from '../Post/Post';
import { Firestore } from '@firebase/firestore';

interface FeedProps {
  db: Firestore;
  userInfo: UserInfoType;
  mode: FeedMode;
}

export enum FeedMode {
  Following,
  Explore,
}

const Feed: React.FC<FeedProps> = ({ db, userInfo, mode }) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [mappedPosts, setMappedPosts] = useState<JSX.Element[]>([]);

  const movePostsToCenter = useMediaQuery('(max-width: 924px)');

  useEffect(() => {
    async function fetchPosts() {
      if (db != null && userInfo != null) {
        const fetchedPosts =
          mode === FeedMode.Following
            ? await getRecentPostsFromFollowing(
                db as Firestore,
                userInfo?.following as string[]
              )
            : await getRecentPostsFromAll(db as Firestore, userInfo.userId, 20);

        if (fetchedPosts !== undefined && fetchedPosts !== null) {
          setPosts(fetchedPosts);

          const postElements = fetchedPosts.map((post) => {
            return <Post key={post.id} post={post} />;
          });

          setMappedPosts(postElements);
        } else {
          setPosts([]);
          setMappedPosts([]);
        }
      }
    }

    fetchPosts();
  }, [db, userInfo, mode]);

  return (
    <div className='post-wrapper'>
      <div
        className={`post-container ${movePostsToCenter ? 'center-align' : ''}`}>
        {mappedPosts}
      </div>
    </div>
  );
};

export default Feed;
