import {
  AppContext,
  AppContextActionType,
  AppContextType,
  Page,
} from '../../Context/AppContext';
import { SyntheticEvent, useContext, useEffect, useState } from 'react';
import '../../styles/login.css';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import LoginLogo from '../../media/instagram-header1.png';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export interface LogInProps {
  dispatch(o: AppContextActionType): void;
}

const LogIn: React.FC<LogInProps> = ({ dispatch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    dispatch({ type: 'changePage', payload: Page.LogInPage });
  }, [dispatch]);

  const isSmall = useMediaQuery('(max-width: 438px)');
  const { auth } = useContext(AppContext) as AppContextType;
  const navigate = useNavigate();

  const handleChange = (name: string) => (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    switch (name) {
      case 'email': {
        setEmail(target.value);
        break;
      }
      case 'password': {
        setPassword(target.value);
        break;
      }
      default:
        break;
    }
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (auth != null) {
      try {
        await signInWithEmailAndPassword(auth, email, password);

        dispatch({ type: 'signIn', payload: true });
        navigate('/', { replace: true });
      } catch (e) {
        // console.log(e);
      }
    }
  };

  return (
    <div className='login-wrapper'>
      <div className='login-container'>
        <div
          className={
            isSmall ? 'login__form-container small' : 'login__form-container'
          }>
          <img className='login__logo' src={LoginLogo} alt=''></img>
          <form className='login__form' onSubmit={handleSubmit}>
            <input
              className='login__form-input'
              type='text'
              aria-required='true'
              required
              placeholder='Email'
              onChange={handleChange('email')}
              value={email}></input>
            <input
              className='login__form-input'
              type='password'
              aria-required='true'
              required
              placeholder='Password'
              onChange={handleChange('password')}
              value={password}></input>
            <button className='instagram-button login__button' type='submit'>
              Log In
            </button>
          </form>
        </div>

        <div className={isSmall ? 'login__signup small' : 'login__signup'}>
          <span>{"Don't have an account? "}</span>
          <span>
            <Link to='/signup' className='login__signup-link'>
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
