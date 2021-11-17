import '../../styles/profile.css';
import { useContext, useState, useEffect } from 'react';
import { AppContext, AppContextType } from '../../Context/AppContext';
import ProfilePhotoFallback from '../../media/profilepic-fallback.jpg';

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
    <div className='profile-header__profile-pic-container'>
      {userProfilePicLoaded ? (
        <img
          className={
            !isSmall
              ? 'profile-header__profile-pic'
              : 'profile-header__profile-pic--small'
          }
          src={`${
            userInfo?.userProfilePic == '' || userInfo == null
              ? ProfilePhotoFallback
              : userInfo?.userProfilePic
          }`}
          alt='Change Profile Pic'></img>
      ) : (
        <div
          className={
            !isSmall
              ? 'profile-header__no-profile-pic'
              : 'profile-header__no-profile-pic--small'
          }>
          <img
            className={
              !isSmall
                ? 'profile-header__profile-pic'
                : 'profile-header__profile-pic--small'
            }
            alt='profile pic'
            src={`${
              userInfo?.userProfilePic == '' || userInfo == null
                ? ProfilePhotoFallback
                : userInfo?.userProfilePic
            }`}></img>
        </div>
      )}
    </div>
  );
};

export default ProfileHeaderPicture;
