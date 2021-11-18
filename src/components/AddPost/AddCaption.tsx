import { SyntheticEvent, useContext } from 'react';
import { AppContext, AppContextType } from '../../Context/AppContext';
import Avatar, { AvatarSize } from '../Avatar';

interface AddCaptionProps {
  handleChange(e: SyntheticEvent): void;
  descriptionValue: string;
}

const AddCaption: React.FC<AddCaptionProps> = ({
  handleChange,
  descriptionValue,
}) => {
  const { userInfo } = useContext(AppContext) as AppContextType;

  return (
    <div className='add-caption'>
      <div className='caption-header'>
        <div className='avatar-wrapper'>
          <Avatar
            size={AvatarSize.Small}
            profilePicSrc={userInfo?.userProfilePic ?? ''}
            alt={`${userInfo?.userNickname}'s profile pic'`}
          />
        </div>
        <div className='caption-header__username'>{`${userInfo?.userNickname}`}</div>
      </div>
      <textarea
        className='caption__input'
        placeholder='Write a caption...'
        maxLength={500}
        value={descriptionValue}
        onChange={handleChange}></textarea>
    </div>
  );
};

export default AddCaption;
