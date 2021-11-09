import { useEffect, useContext } from 'react';
import { AppContextActionType } from '../Context/AppContext';
import { Page, AppContext, AppContextType } from '../Context/AppContext';
import UserInfoType from '../types/userInfoType';

export interface ProfileProps {
  dispatch(o: AppContextActionType): void;
}

const Profile: React.FC<ProfileProps> = ({ dispatch }): JSX.Element => {
  const { userInfo } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    dispatch({ type: 'changePage', payload: Page.ProfilePage });
    console.log(userInfo);
  }, [dispatch]);
  return <div>Profile</div>;
};

export default Profile;
