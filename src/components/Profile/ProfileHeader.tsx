import { useContext } from 'react';
import { AppContext, AppContextType } from '../../Context/AppContext';
import '../../styles/profile.css';
import ProfileHeaderDescription from './ProfileHeaderDescription';
import ProfileHeaderName from './ProfileHeaderName';
import ProfileHeaderPicture from './ProfileHeaderPicture';
import ProfileHeaderStats from './ProfileHeaderStats';
import { useMediaQuery } from '../../hooks/useMediaQuery';

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

  const isSmall = useMediaQuery('(max-width: 720px)');
  return (
    <>
      {!isSmall ? (
        <header className='profile-header'>
          <div className='profile-header__left'>
            <ProfileHeaderPicture isSmall={isSmall} />
          </div>
          <div className='profile-header__right'>
            <ProfileHeaderName nickname={userInfo?.userNickname} />
            <ProfileHeaderStats
              numFollowing={numFollowing ? numFollowing : 0}
              numFollowers={numFollowers ? numFollowers : 0}
              isSmall={isSmall}
            />
            <ProfileHeaderDescription
              name={userInfo?.userName}
              description={userInfo?.description}
              isSmall={isSmall}
            />
          </div>
        </header>
      ) : (
        <header className='profile-header profile-header--small'>
          <div className='profile-header__top'>
            <ProfileHeaderPicture isSmall={isSmall} />
            <ProfileHeaderName nickname={userInfo?.userNickname} />
          </div>
          <div className='profile-header__bottom'>
            <ProfileHeaderDescription
              name={userInfo?.userName}
              description={userInfo?.description}
              isSmall={isSmall}
            />
            <ProfileHeaderStats
              numFollowing={numFollowing ? numFollowing : 0}
              numFollowers={numFollowers ? numFollowers : 0}
              isSmall={isSmall}
            />
          </div>
        </header>
      )}
    </>
  );
};

export default ProfileHeader;
