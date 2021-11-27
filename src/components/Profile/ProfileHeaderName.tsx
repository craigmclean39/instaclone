import { Firestore } from '@firebase/firestore';
import { useContext } from 'react';
import { AppContext, AppContextType } from '../../Context/AppContext';
import '../../styles/profile.css';
import { followUser } from '../../utilities/FirestoreHelpers';

export interface ProfileHeaderNameProps {
  nickname: string | undefined;
  isUser: boolean;
  followingUser: boolean;
  postUserId: string;
}

const ProfileHeaderName: React.FC<ProfileHeaderNameProps> = ({
  nickname,
  isUser,
  followingUser,
  postUserId,
}): JSX.Element => {
  const { auth, db, userInfo, dispatch } = useContext(
    AppContext
  ) as AppContextType;
  const handleClick = () => {
    auth?.signOut();
  };

  const followTheUser = async (follow: boolean) => {
    await followUser(
      db as Firestore,
      postUserId,
      userInfo?.userId as string,
      follow
    );
    dispatch({ type: 'reloadUserInfo', payload: true });
  };

  return (
    <>
      <div className='profile-header__name-container'>
        <h2 className='profile-header__name'>{nickname ? nickname : ''}</h2>
        {isUser ? (
          <button className='instagram-button' onClick={handleClick}>
            Sign Out
          </button>
        ) : followingUser ? (
          <button
            className='instagram-button'
            onClick={() => {
              followTheUser(false);
            }}>
            Unfollow
          </button>
        ) : (
          <button
            className='instagram-button'
            onClick={() => {
              followTheUser(true);
            }}>
            Follow
          </button>
        )}
      </div>
    </>
  );
};

export default ProfileHeaderName;
