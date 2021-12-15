import UserInfoType from '../../types/userInfoType';
import Avatar, { AvatarSize } from '../Avatar/Avatar';
import { Link } from 'react-router-dom';

export interface FriendRowProps {
  friendInfo: UserInfoType;
}

const FriendRow: React.FC<FriendRowProps> = ({ friendInfo }) => {
  return (
    <div className='friend-row'>
      <div className='friend-row__left'>
        <Avatar
          profilePicSrc={friendInfo.userProfilePic}
          size={AvatarSize.Small}
          alt=''
        />
        <div className='friend-row__names'>
          <Link className='link' to={`/users/${friendInfo.userId}`}>
            {friendInfo.userNickname}
          </Link>
          <h3>{friendInfo.userName}</h3>
        </div>
      </div>
      <div className='friend-row__right'></div>
    </div>
  );
};

export default FriendRow;
