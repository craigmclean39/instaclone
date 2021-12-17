import {
  useContext,
  useEffect,
  useState,
  useCallback,
  SyntheticEvent,
} from 'react';
import {
  AppContext,
  AppContextActionType,
  AppContextType,
} from '../Context/AppContext';
import { Page } from '../Context/AppContext';
import '../styles/profile.css';
import ProfileHeader from '../components/Profile/ProfileHeader';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Firestore } from '@firebase/firestore';
import UserInfoType, { PostType } from '../types/userInfoType';
import ProfilePosts from '../components/Profile/ProfilePosts';
import {
  getUserInfo,
  getUsersPosts,
  uploadProfilePic,
} from '../utilities/FirestoreHelpers';
import FriendsModal, {
  FriendsModalMode,
} from '../components/FriendsModal/FriendsModal';

export interface ProfileProps {
  dispatch(o: AppContextActionType): void;
}

const Profile: React.FC<ProfileProps> = ({ dispatch }): JSX.Element => {
  const { userInfo, db } = useContext(AppContext) as AppContextType;

  const [posts, setPosts] = useState<PostType[]>([]);
  const [friendsModalVisible, setFriendsModalVisible] = useState(false);
  const [friendsModalMode, setFriendsModalMode] = useState(
    FriendsModalMode.Followers
  );
  const [friends, setFriends] = useState<UserInfoType[]>([]);
  const [updateProfilePic, setUpdateProfilePic] = useState(false);
  const [newProfilePicFile, setNewProfilePicFile] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch({ type: 'changePage', payload: Page.ProfilePage });
  }, [dispatch]);

  useEffect(() => {
    async function fetchPosts() {
      if (userInfo != null && db != null) {
        const userPosts = await getUsersPosts(
          db as Firestore,
          userInfo?.userId as string
        );

        setPosts(userPosts);
      }

      setIsLoaded(true);
    }

    fetchPosts();

    return () => {
      setIsLoaded(false);
    };
  }, [userInfo, db]);

  useEffect(() => {
    async function doProfilePicUpload() {
      await uploadProfilePic(
        db as Firestore,
        newProfilePicFile,
        userInfo?.userId as string
      );

      dispatch({ type: 'reloadUserInfo', payload: true });
    }

    if (updateProfilePic && newProfilePicFile !== '') {
      doProfilePicUpload();
      setUpdateProfilePic(false);
    }
  }, [updateProfilePic, db, dispatch, newProfilePicFile, userInfo]);

  const isSmall = useMediaQuery('(max-width: 720px)');

  const handleOpenFriendsModal = async (mode: FriendsModalMode) => {
    if (!userInfo) return;

    const friendsToDisplay: UserInfoType[] = [];

    if (mode === FriendsModalMode.Followers) {
      for (let i = 0; i < userInfo?.followers.length; i++) {
        const followerInfo = await getUserInfo(
          userInfo.followers[i],
          db as Firestore
        );

        if (followerInfo != null) {
          friendsToDisplay.push(followerInfo);
        }
      }
    } else if (mode === FriendsModalMode.Following) {
      for (let i = 0; i < userInfo?.following.length; i++) {
        const followerInfo = await getUserInfo(
          userInfo.following[i],
          db as Firestore
        );

        if (followerInfo != null) {
          friendsToDisplay.push(followerInfo);
        }
      }
    }

    setFriends(friendsToDisplay);
    setFriendsModalMode(mode);
    setFriendsModalVisible(true);
  };

  const handleCloseFriendsModal = () => {
    setFriendsModalVisible(false);
  };

  const handleChangeProfilePic = useCallback(async (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;

    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      readFile(file);
    }
  }, []);

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUpdateProfilePic(true);
      setNewProfilePicFile(ev.target?.result as string);
    };

    //Read the file and wait for it to trigger the onload callback
    reader.readAsDataURL(file);
  };

  if (isLoaded) {
    return (
      <>
        <FriendsModal
          visible={friendsModalVisible}
          mode={friendsModalMode}
          handleClose={handleCloseFriendsModal}
          friends={friends}
        />
        <div className='profile-container'>
          <div className='profile-wrapper'>
            <div className={isSmall ? 'profile--small' : 'profile'}>
              <ProfileHeader
                handleChangeProfilePic={handleChangeProfilePic}
                numPosts={posts.length}
                isUser={true}
                postUserId=''
                handleOpenFollowersModal={() => {
                  handleOpenFriendsModal(FriendsModalMode.Followers);
                }}
                handleOpenFollowingModal={() => {
                  handleOpenFriendsModal(FriendsModalMode.Following);
                }}
              />
              {isSmall ? null : (
                <div className='profile__decorative-line'></div>
              )}
              <ProfilePosts posts={posts} isSmall={isSmall} isUser={true} />
            </div>
          </div>
        </div>
      </>
    );
  }
  return <></>;
};

export default Profile;
