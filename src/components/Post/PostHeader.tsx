import '../../styles/post.css';
import Avatar, { AvatarSize } from '../Avatar/Avatar';

interface PostHeaderProps {
  profilePicUrl: string;
  userName: string;
  userFollowed: boolean;
  followTheUser(follow: boolean): void;
}

const PostHeader: React.FC<PostHeaderProps> = ({
  profilePicUrl,
  userName,
  userFollowed,
  followTheUser,
}) => {
  return (
    <>
      <header className='post-header'>
        <div className='post-header__flex'>
          <Avatar
            profilePicSrc={profilePicUrl}
            size={AvatarSize.Medium}
            alt=''
          />
          <h3>{userName}</h3>
          <div className='post__follow'>
            <span>•</span>
            {userFollowed ? (
              <button
                className='post__unfollow-button'
                onClick={() => {
                  followTheUser(false);
                }}>
                Unfollow
              </button>
            ) : (
              <button
                className='post__follow-button'
                onClick={() => {
                  followTheUser(true);
                }}>
                Follow
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default PostHeader;
