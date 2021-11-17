import '../../styles/profile.css';
import { useContext, useState, useEffect } from 'react';
import { AppContext, AppContextType } from '../../Context/AppContext';
import Avatar, { AvatarSize } from '../Avatar';

interface ProfileHeaderPictureProps {
  isSmall: boolean;
}

const ProfileHeaderPicture: React.FC<ProfileHeaderPictureProps> = ({
  isSmall,
}) => {
  const { userInfo } = useContext(AppContext) as AppContextType;
  const [userProfilePicLoaded, setUserProfilePicLoaded] = useState(false);

  useEffect(() => {
    if (userInfo?.userProfilePic) {
      setUserProfilePicLoaded(true);
    }
  }, [userInfo]);

  return (
    <div
      className={
        isSmall
          ? 'profile-header__profile-pic-container--small'
          : 'profile-header__profile-pic-container'
      }>
      <Avatar
        size={isSmall ? AvatarSize.Medium : AvatarSize.Large}
        alt='Change profile picture'
        profilePicSrc={userInfo?.userProfilePic ?? ''}
      />
    </div>
  );
};

export default ProfileHeaderPicture;
