import '../../styles/profile.css';
import { SyntheticEvent } from 'react';

import Avatar, { AvatarSize } from '../Avatar/Avatar';

interface ProfileHeaderPictureProps {
  isSmall: boolean;
  imgUrl: string;
  isUser: boolean;
  handleClick(e: SyntheticEvent): Promise<void>;
}

const ProfileHeaderPicture: React.FC<ProfileHeaderPictureProps> = ({
  isSmall,
  imgUrl,
  isUser,
  handleClick,
}) => {
  return (
    <>
      <label
        htmlFor='select-profile-pic'
        className={`profile-header__profile-pic-container${
          isSmall ? '--small' : ''
        } ${isUser ? 'cursor-pointer' : ''}`}>
        <Avatar
          size={isSmall ? AvatarSize.Large : AvatarSize.ExtraLarge}
          alt='Change profile picture'
          profilePicSrc={imgUrl}
        />
      </label>
      {isUser ? (
        <input
          className='not-visible'
          id='select-profile-pic'
          type='file'
          accept='image/*'
          onChange={(e) => {
            handleClick(e);
          }}></input>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProfileHeaderPicture;
