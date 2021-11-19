import { PostType } from '../../types/userInfoType';
import '../../styles/profile.css';
import { useEffect, useState } from 'react';
import ProfilePost from './ProfilePost';

interface ProfilePostsProps {
  posts: PostType[];
  isSmall: boolean;
}

const ProfilePosts: React.FC<ProfilePostsProps> = ({ posts, isSmall }) => {
  const [postRows, setPostRows] = useState<JSX.Element[]>();

  useEffect(() => {
    const groupSize = 3;
    const rows = posts
      .map(function (post) {
        // map content to html elements
        return <ProfilePost post={post} />;
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
        return (
          <div className={`profile-posts-row ${isSmall ? 'small-gap' : ''}`}>
            {rowContent}
          </div>
        );
      });

    setPostRows(rows);
  }, [posts, isSmall]);

  return (
    <div className={`profile-posts-wrapper ${isSmall ? 'small-gap' : ''}`}>
      {postRows}
    </div>
  );
};

export default ProfilePosts;
