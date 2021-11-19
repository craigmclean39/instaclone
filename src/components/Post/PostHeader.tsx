import '../../styles/post.css';
import Avatar, { AvatarSize } from '../Avatar';

interface PostHeaderProps {
  profilePicUrl: string;
  userName: string;
}

const PostHeader: React.FC<PostHeaderProps> = ({ profilePicUrl, userName }) => {
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
        </div>
      </header>
    </>
  );
};

export default PostHeader;
