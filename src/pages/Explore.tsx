import { useEffect } from 'react';
import { AppContextActionType } from '../Context/AppContext';
import { Page } from '../Context/AppContext';

export interface ExploreProps {
  dispatch(o: AppContextActionType): any;
}

const Explore: React.FC<ExploreProps> = ({ dispatch }): JSX.Element => {
  useEffect(() => {
    dispatch({ type: 'changePage', payload: Page.ExplorePage });
  }, [dispatch]);

  return <div>Explore</div>;
};

export default Explore;
