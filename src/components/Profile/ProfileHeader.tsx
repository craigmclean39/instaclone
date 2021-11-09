import { useContext } from 'react';
import { AppContext, AppContextType } from '../../Context/AppContext';
import '../../styles/profile.css';
import ProfileHeaderDescription from './ProfileHeaderDescription';
import ProfileHeaderName from './ProfileHeaderName';
import ProfileHeaderPicture from './ProfileHeaderPicture';
import ProfileHeaderStats from './ProfileHeaderStats';

const ProfileHeader: React.FC = () => {
  const { userInfo } = useContext(AppContext) as AppContextType;

  const countUsers = (prev: any, current: any) => {
    if (current != '') {
      return prev + 1;
    } else {
      return prev;
    }
  };

  const numFollowers = userInfo?.followers.reduce(countUsers, 0);

  const numFollowing = userInfo?.following.reduce(countUsers, 0);

  return (
    <>
      <header className='profile-header'>
        <div className='profile-header__left'>
          <ProfileHeaderPicture />
        </div>
        <div className='profile-header__right'>
          <ProfileHeaderName nickname={userInfo?.userNickname} />
          <ProfileHeaderStats
            numFollowing={numFollowing ? numFollowing : 0}
            numFollowers={numFollowers ? numFollowers : 0}
          />
          <ProfileHeaderDescription
            name={userInfo?.userName}
            description={userInfo?.description}
          />
        </div>
      </header>
    </>
  );
};

export default ProfileHeader;
