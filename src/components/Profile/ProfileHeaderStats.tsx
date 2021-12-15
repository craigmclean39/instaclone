import '../../styles/profile.css';

export interface ProfileHeaderStatsProps {
  numFollowers: number;
  numFollowing: number;
  numPosts: number;
  isSmall: boolean;
  handleOpenFollowersModal(): void;
  handleOpenFollowingModal(): void;
}

const ProfileHeaderStats: React.FC<ProfileHeaderStatsProps> = ({
  numFollowers,
  numFollowing,
  numPosts,
  isSmall,
  handleOpenFollowersModal,
  handleOpenFollowingModal,
}) => {
  return (
    <ul
      className={
        isSmall ? 'header-profile__stats--small' : 'header-profile__stats'
      }>
      <li>
        <span>{numPosts}</span>
        <span>{' posts'}</span>
      </li>
      <li
        className='li-link'
        onClick={() => {
          handleOpenFollowersModal();
        }}>
        <span>{numFollowers}</span>
        <span>{' followers'}</span>
      </li>
      <li
        className='li-link'
        onClick={() => {
          handleOpenFollowingModal();
        }}>
        <span>{numFollowing}</span>
        <span>{' following'}</span>
      </li>
    </ul>
  );
};

export default ProfileHeaderStats;
