import { useEffect, useContext } from 'react';
import {
  AppContextActionType,
  AppContext,
  AppContextType,
} from '../Context/AppContext';
import { Page } from '../Context/AppContext';
import { Firestore } from '@firebase/firestore';
import UserInfoType from '../types/userInfoType';
import Feed, { FeedMode } from '../components/Feed/Feed';

export interface HomeProps {
  dispatch(o: AppContextActionType): void;
}

const Home: React.FC<HomeProps> = ({ dispatch }): JSX.Element => {
  const { userInfo, db } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    dispatch({ type: 'changePage', payload: Page.HomePage });
  }, [dispatch]);

  if (db != null && userInfo != null) {
    return (
      <Feed
        db={db as Firestore}
        userInfo={userInfo as UserInfoType}
        mode={FeedMode.Following}
      />
    );
  }
  return <></>;
};

export default Home;
