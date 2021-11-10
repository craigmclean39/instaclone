import '../../styles/profile.css';

export interface ProfileHeaderDescriptionProps {
  name: string | undefined;
  description: string | undefined;
  isSmall: boolean;
}

const ProfileHeaderDescription: React.FC<ProfileHeaderDescriptionProps> = ({
  name,
  description,
  isSmall,
}) => {
  return (
    <section
      className={
        isSmall
          ? 'profile-header__description--small'
          : 'profile-header__description'
      }>
      <h1>{name ? name : ''}</h1>
      <p>{description ? description : ''}</p>
    </section>
  );
};

export default ProfileHeaderDescription;
