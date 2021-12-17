import '../../styles/friendsmodal.css';
import { ReactComponent as CloseIcon } from '../../media/close.svg';
import UserInfoType from '../../types/userInfoType';
import FriendRow from './FriendRow';

export interface FriendsModalProps {
  visible: boolean;
  mode: FriendsModalMode;
  handleClose(): void;
  friends: UserInfoType[];
}

export enum FriendsModalMode {
  Following = 'Following',
  Followers = 'Followers',
}

const FriendsModal: React.FC<FriendsModalProps> = ({
  visible,
  mode,
  handleClose,
  friends,
}) => {
  const friendElements = friends.map((friendInfo) => {
    return <FriendRow key={friendInfo.userId} friendInfo={friendInfo} />;
  });

  if (visible) {
    return (
      <div className='dark-overlay'>
        <div className='friends-modal'>
          <div className='friends-modal__header'>
            <div className='header__top-corner'></div>
            <h1>{mode}</h1>
            <div className='header__top-corner'>
              <CloseIcon
                onClick={() => {
                  handleClose();
                }}
              />
            </div>
          </div>
          <div className='friends-modal__friends'>{friendElements}</div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default FriendsModal;
