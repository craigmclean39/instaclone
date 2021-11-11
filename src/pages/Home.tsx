import { useContext, useEffect } from 'react';
import {
  AppContext,
  AppContextActionType,
  AppContextType,
} from '../Context/AppContext';
import { Page } from '../Context/AppContext';
import Post from '../components/Post/Post';

export interface HomeProps {
  dispatch(o: AppContextActionType): void;
}

const Home: React.FC<HomeProps> = ({ dispatch }): JSX.Element => {
  useEffect(() => {
    dispatch({ type: 'changePage', payload: Page.HomePage });
  }, [dispatch]);

  return (
    <div className='post-wrapper'>
      <div className='post-container'>
        <Post />
        <Post />
      </div>
    </div>
  );
};

export default Home;
