import { useContext, useEffect, useState } from 'react';
import { AppContext, AppContextType } from '../../Context/AppContext';
import '../../styles/profile.css';
import ProfileHeaderDescription from './ProfileHeaderDescription';
import ProfileHeaderName from './ProfileHeaderName';
import ProfileHeaderPicture from './ProfileHeaderPicture';
import ProfileHeaderStats from './ProfileHeaderStats';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { getUserInfo } from '../../utilities/FirestoreHelpers';
import { Firestore } from '@firebase/firestore';
import UserInfoType from '../../types/userInfoType';

interface ProfileHeaderProps {
  numPosts: number;
  isUser: boolean;
  postUserId: string;
  handleOpenFollowersModal(): void;
  handleOpenFollowingModal(): void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  numPosts,
  isUser,
  postUserId,
  handleOpenFollowersModal,
  handleOpenFollowingModal,
}) => {
  const { userInfo, db } = useContext(AppContext) as AppContextType;
  const [postUserInfo, setPostUserInfo] = useState<UserInfoType | null>(null);
  const [followingUser, setFollowingUser] = useState(false);

  const countUsers = (prev: any, current: any) => {
    if (current !== '') {
      return prev + 1;
    } else {
      return prev;
    }
  };

  const [numFollowing, setNumFollowing] = useState(0);
  const [numFollowers, setNumFollowers] = useState(0);

  useEffect(() => {
    if (isUser) {
      setNumFollowers(userInfo?.followers.reduce(countUsers, 0));
      setNumFollowing(userInfo?.following.reduce(countUsers, 0));
    } else {
      setNumFollowers(postUserInfo?.followers.reduce(countUsers, 0));
      setNumFollowing(postUserInfo?.following.reduce(countUsers, 0));
    }
  }, [userInfo, postUserInfo, isUser]);

  useEffect(() => {
    const fetchPostUserInfo = async function () {
      if (!isUser) {
        const info: UserInfoType = (await getUserInfo(
          postUserId,
          db as Firestore
        )) as UserInfoType;
        setPostUserInfo(info);
      }
    };

    fetchPostUserInfo();
  });

  useEffect(() => {
    if (!isUser) {
      if (userInfo?.following.includes(postUserId)) {
        setFollowingUser(true);
      } else {
        setFollowingUser(false);
      }
    }
  }, [userInfo, isUser, postUserId]);

  const isSmall = useMediaQuery('(max-width: 720px)');
  return (
    <>
      {!isSmall ? (
        <header className='profile-header'>
          <div className='profile-header__left'>
            <ProfileHeaderPicture
              isSmall={isSmall}
              imgUrl={
                isUser
                  ? userInfo?.userProfilePic ?? ''
                  : postUserInfo?.userProfilePic ?? ''
              }
            />
          </div>
          <div className='profile-header__right'>
            <ProfileHeaderName
              nickname={
                isUser ? userInfo?.userNickname : postUserInfo?.userNickname
              }
              isUser={isUser}
              followingUser={followingUser}
              postUserId={postUserInfo?.userId ?? ''}
            />
            <ProfileHeaderStats
              numFollowing={numFollowing ? numFollowing : 0}
              numFollowers={numFollowers ? numFollowers : 0}
              numPosts={numPosts}
              isSmall={isSmall}
              handleOpenFollowersModal={handleOpenFollowersModal}
              handleOpenFollowingModal={handleOpenFollowingModal}
            />
            <ProfileHeaderDescription
              name={isUser ? userInfo?.userName : postUserInfo?.userName}
              description={
                isUser ? userInfo?.description : postUserInfo?.description
              }
              isSmall={isSmall}
            />
          </div>
        </header>
      ) : (
        <header className='profile-header profile-header--small'>
          <div className='profile-header__top'>
            <ProfileHeaderPicture
              isSmall={isSmall}
              imgUrl={
                isUser
                  ? userInfo?.userProfilePic ?? ''
                  : postUserInfo?.userProfilePic ?? ''
              }
            />
            <ProfileHeaderName
              nickname={
                isUser ? userInfo?.userNickname : postUserInfo?.userNickname
              }
              isUser={isUser}
              followingUser={followingUser}
              postUserId={postUserInfo?.userId ?? ''}
            />
          </div>
          <div className='profile-header__bottom'>
            <ProfileHeaderDescription
              name={isUser ? userInfo?.userName : postUserInfo?.userName}
              description={
                isUser ? userInfo?.description : postUserInfo?.description
              }
              isSmall={isSmall}
            />
            <ProfileHeaderStats
              numFollowing={numFollowing ? numFollowing : 0}
              numFollowers={numFollowers ? numFollowers : 0}
              numPosts={numPosts}
              isSmall={isSmall}
              handleOpenFollowersModal={handleOpenFollowersModal}
              handleOpenFollowingModal={handleOpenFollowingModal}
            />
          </div>
        </header>
      )}
    </>
  );
};

export default ProfileHeader;
