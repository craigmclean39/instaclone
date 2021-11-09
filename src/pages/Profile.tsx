import { useEffect, useContext } from 'react';
import { AppContextActionType } from '../Context/AppContext';
import { Page, AppContext, AppContextType } from '../Context/AppContext';
import UserInfoType from '../types/userInfoType';
import '../styles/profile.css';
import ProfileHeader from '../components/Profile/ProfileHeader';
import { useMediaQuery } from '../hooks/useMediaQuery';

export interface ProfileProps {
  dispatch(o: AppContextActionType): void;
}

const Profile: React.FC<ProfileProps> = ({ dispatch }): JSX.Element => {
  const { userInfo } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    dispatch({ type: 'changePage', payload: Page.ProfilePage });
    console.log(userInfo);
  }, [dispatch]);

  const isSmall = useMediaQuery('(max-width: 720px)');

  return (
    <div className='profile-container'>
      <div className={isSmall ? 'profile--small' : 'profile'}>
        <ProfileHeader />
      </div>
    </div>
  );
};

export default Profile;
