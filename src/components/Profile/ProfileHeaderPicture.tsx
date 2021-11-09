import '../../styles/profile.css';
import { useContext, useState, useEffect } from 'react';
import { AppContext, AppContextType } from '../../Context/AppContext';

const ProfileHeaderPicture: React.FC = () => {
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
          className='profile-header__profile-pic'
          src={userInfo?.userProfilePic}
          alt='Change Profile Pic'></img>
      ) : (
        <div className='profile-header__no-profile-pic'></div>
      )}
    </div>
  );
};

export default ProfileHeaderPicture;
