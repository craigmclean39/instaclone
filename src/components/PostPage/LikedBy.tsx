import { Firestore } from '@firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext, AppContextType } from '../../Context/AppContext';
import UserInfoType from '../../types/userInfoType';
import { getUserInfo } from '../../utilities/FirestoreHelpers';
import Avatar, { AvatarSize } from '../Avatar/Avatar';

interface LikedByProps {
  likes: string[];
}

const LikedBy: React.FC<LikedByProps> = ({ likes }) => {
  const [firstLikeUserInfo, setFirstLikeUserInfo] =
    useState<UserInfoType | null>(null);

  const { db } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    async function fetchUserInfo() {
      if (likes.length > 0) {
        const fetchedInfo = await getUserInfo(likes[0], db as Firestore);
        setFirstLikeUserInfo(fetchedInfo);
      }
    }

    fetchUserInfo();
  }, [likes, db]);

  if (likes.length > 0) {
    return (
      <div className='liked-by'>
        <Avatar
          profilePicSrc={firstLikeUserInfo?.userProfilePic ?? ''}
          size={AvatarSize.ExtraSmall}
          alt=''
        />
        <span className='liked-by__text'>Liked by</span>&nbsp;
        <Link
          className='link liked-by__link'
          to={`/users/${firstLikeUserInfo?.userId}`}>
          {' '}
          {`${firstLikeUserInfo?.userNickname}`}
        </Link>
        &nbsp;
        {`${likes.length > 1 ? ' and others' : ''}`}
      </div>
    );
  }

  return null;
};

export default LikedBy;
