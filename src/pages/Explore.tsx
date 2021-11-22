import { useEffect, useContext } from 'react';
import { AppContextActionType } from '../Context/AppContext';
import { Page } from '../Context/AppContext';
import Feed from '../components/Feed/Feed';
import { AppContext, AppContextType } from '../Context/AppContext';
import { FeedMode } from '../components/Feed/Feed';
import UserInfoType from '../types/userInfoType';
import { Firestore } from '@firebase/firestore';

export interface ExploreProps {
  dispatch(o: AppContextActionType): void;
}

const Explore: React.FC<ExploreProps> = ({ dispatch }): JSX.Element => {
  const { userInfo, db } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    dispatch({ type: 'changePage', payload: Page.ExplorePage });
  }, [dispatch]);

  if (db != null && userInfo != null) {
    return (
      <Feed
        db={db as Firestore}
        userInfo={userInfo as UserInfoType}
        mode={FeedMode.Explore}
      />
    );
  }
  return <></>;
};

export default Explore;
