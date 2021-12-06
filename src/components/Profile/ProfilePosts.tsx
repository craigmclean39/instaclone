import { PostType } from '../../types/userInfoType';
import '../../styles/profile.css';
import { useEffect, useState } from 'react';
import ProfilePost from './ProfilePost';
import PostImage from '../Post/PostImage';
import { Link } from 'react-router-dom';

interface ProfilePostsProps {
  posts: PostType[];
  isSmall: boolean;
  isUser: boolean;
}

const ProfilePosts: React.FC<ProfilePostsProps> = ({
  posts,
  isSmall,
  isUser,
}) => {
  const [postRows, setPostRows] = useState<JSX.Element[]>();

  useEffect(() => {
    const groupSize = 3;
    let rowKey = 0;
    const revPosts = [...posts];
    revPosts.reverse();
    const rows = revPosts
      .map(function (post) {
        // map content to html elements
        if (isUser) {
          return (
            <Link to={`/posts/${post.id}`}>
              <ProfilePost key={post.id} post={post} />
            </Link>
          );
        }
        return (
          <Link to={`/posts/${post.id}`}>
            <PostImage key={post.id} imgUrl={post.imgUrl} />
          </Link>
        );
      })
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
            className={`profile-posts-row ${isSmall ? 'small-gap' : ''}`}
            key={rowKey}>
            {rowContent}
          </div>
        );
      });

    setPostRows(rows);
  }, [posts, isSmall, isUser]);

  return (
    <div className={`profile-posts-wrapper ${isSmall ? 'small-gap' : ''}`}>
      {postRows}
    </div>
  );
};

export default ProfilePosts;
