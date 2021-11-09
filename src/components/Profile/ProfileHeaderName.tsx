import '../../styles/profile.css';

export interface ProfileHeaderNameProps {
  nickname: string | undefined;
}

const ProfileHeaderName: React.FC<ProfileHeaderNameProps> = ({
  nickname,
}): JSX.Element => {
  return (
    <>
      <h2 className='profile-header__name'>{nickname ? nickname : ''}</h2>
    </>
  );
};

export default ProfileHeaderName;
