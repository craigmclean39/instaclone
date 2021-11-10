import '../../styles/profile.css';

export interface ProfileHeaderStatsProps {
  numFollowers: number;
  numFollowing: number;
  isSmall: boolean;
}

const ProfileHeaderStats: React.FC<ProfileHeaderStatsProps> = ({
  numFollowers,
  numFollowing,
  isSmall,
}) => {
  return (
    <ul
      className={
        isSmall ? 'header-profile__stats--small' : 'header-profile__stats'
      }>
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
