import '../../styles/profile.css';

export interface ProfileHeaderStatsProps {
  numFollowers: number;
  numFollowing: number;
}

const ProfileHeaderStats: React.FC<ProfileHeaderStatsProps> = ({
  numFollowers,
  numFollowing,
}) => {
  return (
    <ul className='header-profile__stats'>
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
