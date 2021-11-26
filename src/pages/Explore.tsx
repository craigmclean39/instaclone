import { useEffect, useContext } from 'react';
import { AppContextActionType } from '../Context/AppContext';
import { Page } from '../Context/AppContext';
import { AppContext, AppContextType } from '../Context/AppContext';
import UserInfoType from '../types/userInfoType';
import { Firestore } from '@firebase/firestore';
import ExploreGrid from '../components/Explore/ExploreGrid';
import '../styles/explore.css';
import { useMediaQuery } from '../hooks/useMediaQuery';

export interface ExploreProps {
  dispatch(o: AppContextActionType): void;
}

const Explore: React.FC<ExploreProps> = ({ dispatch }): JSX.Element => {
  const { userInfo, db } = useContext(AppContext) as AppContextType;
  const isSmall = useMediaQuery('(max-width: 720px)');

  useEffect(() => {
    dispatch({ type: 'changePage', payload: Page.ExplorePage });
  }, [dispatch]);

  if (db != null && userInfo != null) {
    return (
      <div className='explore-container'>
        <div className={`explore-wrapper ${isSmall ? 'explore--small' : ''}`}>
          <ExploreGrid
            isSmall={isSmall}
            db={db as Firestore}
            userInfo={userInfo as UserInfoType}
          />
        </div>
      </div>
    );
  }
  return <></>;
};

export default Explore;
