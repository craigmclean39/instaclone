import { useEffect } from 'react';
import { AppContextActionType } from '../Context/AppContext';
import { Page } from '../Context/AppContext';
import '../styles/profile.css';
import ProfileHeader from '../components/Profile/ProfileHeader';
import { useMediaQuery } from '../hooks/useMediaQuery';

export interface ProfileProps {
  dispatch(o: AppContextActionType): void;
}

const Profile: React.FC<ProfileProps> = ({ dispatch }): JSX.Element => {
  useEffect(() => {
    dispatch({ type: 'changePage', payload: Page.ProfilePage });
  }, [dispatch]);

  const isSmall = useMediaQuery('(max-width: 720px)');

  return (
    <div className='profile-container'>
      <div className={isSmall ? 'profile--small' : 'profile'}>
        <ProfileHeader />
        {isSmall ? null : <div className='profile__decorative-line'></div>}
      </div>
    </div>
  );
};

export default Profile;
