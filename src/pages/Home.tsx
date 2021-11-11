import { useContext, useEffect } from 'react';
import {
  AppContext,
  AppContextActionType,
  AppContextType,
} from '../Context/AppContext';
import { Page } from '../Context/AppContext';
import Post from '../components/Post/Post';
import { useNavigate } from 'react-router';

export interface HomeProps {
  dispatch(o: AppContextActionType): void;
}

const Home: React.FC<HomeProps> = ({ dispatch }): JSX.Element => {
  const { signedIn } = useContext(AppContext) as AppContextType;
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({ type: 'changePage', payload: Page.HomePage });
  }, [dispatch]);

  useEffect(() => {
    if (!signedIn) {
      navigate('/login', { replace: true });
    }
  }, [signedIn, navigate]);

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
