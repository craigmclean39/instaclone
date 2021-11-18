import { useContext } from 'react';
import { AppContext, AppContextType } from '../../Context/AppContext';
import Avatar, { AvatarSize } from '../Avatar';
const AddCaption = () => {
  const { userInfo } = useContext(AppContext) as AppContextType;

  return (
    <div className='caption-header'>
      <div className='avatar-wrapper'>
        <Avatar
          size={AvatarSize.Small}
          profilePicSrc={userInfo?.userProfilePic ?? ''}
          alt={`${userInfo?.userNickname}'s profile pic'`}
        />
      </div>
      <div className='caption-header__username'>{`${userInfo?.userNickname}`}</div>
    </div>
  );
};

export default AddCaption;
