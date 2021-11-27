import { useContext } from 'react';
import { AppContext, AppContextType } from '../../Context/AppContext';
import '../../styles/profile.css';

export interface ProfileHeaderNameProps {
  nickname: string | undefined;
  isUser: boolean;
}

const ProfileHeaderName: React.FC<ProfileHeaderNameProps> = ({
  nickname,
  isUser,
}): JSX.Element => {
  const { auth } = useContext(AppContext) as AppContextType;
  const handleClick = () => {
    auth?.signOut();
  };

  return (
    <>
      <div className='profile-header__name-container'>
        <h2 className='profile-header__name'>{nickname ? nickname : ''}</h2>
        {isUser ? (
          <button className='instagram-button' onClick={handleClick}>
            Sign Out
          </button>
        ) : null}
      </div>
    </>
  );
};

export default ProfileHeaderName;
