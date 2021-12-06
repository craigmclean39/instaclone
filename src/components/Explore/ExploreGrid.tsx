import { Firestore } from '@firebase/firestore';
import UserInfoType from '../../types/userInfoType';
import { useEffect, useState } from 'react';
import { getRecentPostsFromAll } from '../../utilities/FirestoreHelpers';
import PostImage from '../Post/PostImage';
import { Link } from 'react-router-dom';

interface ExploreGridProps {
  db: Firestore;
  userInfo: UserInfoType;
  isSmall: boolean;
}

const ExploreGrid: React.FC<ExploreGridProps> = ({ db, userInfo, isSmall }) => {
  const [posts, setPosts] = useState<JSX.Element[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      const recentPosts = await getRecentPostsFromAll(
        db as Firestore,
        userInfo.userId,
        100
      );

      //put all the recent posts into a Map, keyed to the post authors userid
      //then I can iterate through the map and just show the first image, so you don't
      //end up with an explore feed filled with posts from the same user
      const postMap = new Map();

      recentPosts.map((post) => {
        if (postMap.has(post.uid)) {
          postMap.get(post.uid).push(post);
        } else {
          postMap.set(post.uid, []);
          postMap.get(post.uid).push(post);
        }
        return null;
      });

      const onePostPerUser: JSX.Element[] = [];
      postMap.forEach((valueArr) => {
        onePostPerUser.push(
          <div key={valueArr[0].postId}>
            <Link to={`/users/${valueArr[0].uid}`}>
              <PostImage imgUrl={valueArr[0].imgUrl} />
            </Link>
          </div>
        );
      });

      const groupSize = 3;
      let rowKey = 0;
      const rows = onePostPerUser
        .reduce(function (r: any, element, index) {
          // create element groups with size 3, result looks like:
          // [[elem1, elem2, elem3], [elem4, elem5, elem6], ...]
          index % groupSize === 0 && r.push([]);
          r[r.length - 1].push(element);
          return r;
        }, [])
        .map(function (rowContent: any) {
          // surround every group with 'row'
          rowKey = rowKey + 1;
          return (
            <div
              className={`explore-posts-row ${isSmall ? 'small-gap' : ''}`}
              key={rowKey}>
              {rowContent}
            </div>
          );
        });

      setPosts(rows);
    }

    fetchPosts();
  }, [db, userInfo, isSmall]);

  return (
    <section className={`explore-posts-wrapper ${isSmall ? 'small-gap' : ''}`}>
      {posts}
    </section>
  );
};

export default ExploreGrid;
