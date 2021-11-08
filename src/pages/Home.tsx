import { useEffect } from 'react';
import { AppContextActionType } from '../Context/AppContext';
import { Page } from '../Context/AppContext';

export interface HomeProps {
  dispatch(o: AppContextActionType): any;
}

const Home: React.FC<HomeProps> = ({ dispatch }): JSX.Element => {
  useEffect(() => {
    dispatch({ type: 'changePage', payload: Page.HomePage });
  }, [dispatch]);
  return <div>Home</div>;
};

export default Home;
