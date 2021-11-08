import { useEffect } from 'react';
import { AppContextActionType } from '../Context/AppContext';
import { Page } from '../Context/AppContext';
import Post from '../components/Post';

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
