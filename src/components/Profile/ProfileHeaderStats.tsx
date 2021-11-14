import '../../styles/profile.css';

export interface ProfileHeaderStatsProps {
  numFollowers: number;
  numFollowing: number;
  numPosts: number;
  isSmall: boolean;
}

const ProfileHeaderStats: React.FC<ProfileHeaderStatsProps> = ({
  numFollowers,
  numFollowing,
  numPosts,
  isSmall,
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
      <li>
        <span>{numFollowers}</span>
        <span>{' followers'}</span>
      </li>
      <li>
        <span>{numFollowing}</span>
        <span>{' following'}</span>
      </li>
    </ul>
  );
};

export default ProfileHeaderStats;
