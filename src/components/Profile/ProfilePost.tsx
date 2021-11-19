import { PostType } from '../../types/userInfoType';
import { ReactComponent as LikeIcon } from '../../media/likefilled.svg';
import { ReactComponent as CommentIcon } from '../../media/comment.svg';
import { SyntheticEvent, useState } from 'react';

interface ProfilePostProps {
  post: PostType;
}

const ProfilePost: React.FC<ProfilePostProps> = ({ post }) => {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleMouseOver = () => {
    setShowOverlay(true);
  };

  const handleMouseOut = () => {
    setShowOverlay(false);
  };

  return (
    <div
      className='profile__post-container'
      onMouseOver={handleMouseOver}
      onFocus={handleMouseOver}
      onMouseOut={handleMouseOut}
      onBlur={handleMouseOut}>
      <img
        className='profile__post'
        src={post.imgUrl}
        alt=''
        key={post.id}></img>
      <div className={`profile__post-overlay ${showOverlay ? 'visible' : ''}`}>
        <div className='profile__post-stats'>
          <div className='profile__post-stat'>
            <LikeIcon />
            <div>{post.likes.length}</div>
          </div>
          <div className='profile__post-stat'>
            <CommentIcon />
            <div>{post.comments.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePost;
