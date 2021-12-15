import { useState, useEffect, useRef, useCallback } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import UserInfoType, { PostType } from '../../types/userInfoType';
import {
  getRecentPostsFromFollowing,
  RecentPostsInterface,
} from '../../utilities/FirestoreHelpers';
import Post from '../Post/Post';
import {
  DocumentData,
  QueryDocumentSnapshot,
  Firestore,
} from '@firebase/firestore';

interface FeedProps {
  db: Firestore;
  userInfo: UserInfoType;
}

const Feed: React.FC<FeedProps> = ({ db, userInfo }) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [mappedPosts, setMappedPosts] = useState<JSX.Element[]>([]);
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [doFetchPosts, setDoFetchPosts] = useState(true);
  const [endOfPage, setEndOfPage] = useState(false);

  const movePostsToCenter = useMediaQuery('(max-width: 924px)');
  const bottomOfPageRef = useRef(null);

  const scrollObserver = useCallback((node) => {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
          // console.log('bottom of page');
          setDoFetchPosts(true);
        }
      });
    }).observe(node);
  }, []);

  useEffect(() => {
    if (bottomOfPageRef.current) {
      scrollObserver(bottomOfPageRef.current);
    }
  }, [scrollObserver, bottomOfPageRef]);

  useEffect(() => {
    async function fetchPosts() {
      if (db != null && userInfo != null && doFetchPosts && !endOfPage) {
        setDoFetchPosts(false);
        const { posts: fetchedPosts, lastVisible: newLastVisible } =
          (await getRecentPostsFromFollowing(
            db as Firestore,
            userInfo?.following as string[],
            5,
            lastVisible
          )) as RecentPostsInterface;

        setLastVisible(newLastVisible);
        if (newLastVisible === undefined) {
          setEndOfPage(true);
        }

        if (lastVisible === null) {
          if (
            fetchedPosts !== undefined &&
            fetchedPosts !== null &&
            fetchedPosts.length > 0
          ) {
            setPosts(fetchedPosts);

            const postElements = fetchedPosts.map((post) => {
              return <Post key={post.id} post={post} />;
            });

            setMappedPosts(postElements);
          }
        } else {
          if (fetchedPosts !== undefined && fetchedPosts !== null) {
            const concatPosts = posts.concat(fetchedPosts);
            setPosts(concatPosts);

            const postElements = concatPosts.map((post) => {
              return <Post key={post.id} post={post} />;
            });

            setMappedPosts(postElements);
          }
        }
      }
    }

    fetchPosts();
  }, [db, userInfo, doFetchPosts, endOfPage, lastVisible, posts]);

  return (
    <div className='post-wrapper'>
      <div
        className={`post-container ${movePostsToCenter ? 'center-align' : ''}`}>
        {mappedPosts}
      </div>
      <div
        className='the-end'
        style={{ height: '5px', width: '100%' }}
        ref={bottomOfPageRef}></div>
    </div>
  );
};

export default Feed;
