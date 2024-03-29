import ProfilePhotoFallback from '../../media/profilepic-fallback.jpg';
import '../../styles/avatar.css';
export enum AvatarSize {
  ExtraSmall = 'extra-small',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  ExtraLarge = 'extra-large',
}

interface AvatarProps {
  profilePicSrc: string;
  size: AvatarSize;
  alt: string;
}

const Avatar: React.FC<AvatarProps> = ({ profilePicSrc, size, alt }) => {
  return (
    <img
      className={`avatar--${size}`}
      alt={alt}
      src={`${
        profilePicSrc === '' || profilePicSrc == null
          ? ProfilePhotoFallback
          : profilePicSrc
      }`}></img>
  );
};

export default Avatar;
