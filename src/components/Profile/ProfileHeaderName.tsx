import { useContext } from 'react';
import { AppContext, AppContextType } from '../../Context/AppContext';
import '../../styles/profile.css';

export interface ProfileHeaderNameProps {
  nickname: string | undefined;
}

const ProfileHeaderName: React.FC<ProfileHeaderNameProps> = ({
  nickname,
}): JSX.Element => {
  const { auth } = useContext(AppContext) as AppContextType;
  const handleClick = () => {
    auth?.signOut();
  };

  return (
    <>
      <div className='profile-header__name-container'>
        <h2 className='profile-header__name'>{nickname ? nickname : ''}</h2>
        <button onClick={handleClick}>Sign Out</button>
      </div>
    </>
  );
};

export default ProfileHeaderName;
