import '../../styles/profile.css';

export interface ProfileHeaderDescriptionProps {
  name: string | undefined;
  description: string | undefined;
}

const ProfileHeaderDescription: React.FC<ProfileHeaderDescriptionProps> = ({
  name,
  description,
}) => {
  return (
    <section className='profile-header__description'>
      <h1>{name ? name : ''}</h1>
      <p>{description ? description : ''}</p>
    </section>
  );
};

export default ProfileHeaderDescription;
