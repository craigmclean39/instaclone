import {
  AppContext,
  AppContextActionType,
  AppContextType,
  Page,
} from '../../Context/AppContext';
import { SyntheticEvent, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { createNewUser } from '../../utilities/FirestoreHelpers';
import '../../styles/login.css';
import LoginLogo from '../../media/instagram-header1.png';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { FirebaseError } from '@firebase/util';

export interface SignUpProps {
  dispatch(o: AppContextActionType): void;
}

const SignUp: React.FC<SignUpProps> = ({ dispatch }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    dispatch({ type: 'changePage', payload: Page.SignUpPage });
  }, [dispatch]);

  const isSmall = useMediaQuery('(max-width: 438px)');
  const { db, auth } = useContext(AppContext) as AppContextType;
  const navigate = useNavigate();

  const handleChange = (name: string) => (e: SyntheticEvent) => {
    setErrorMessage('');

    const target = e.target as HTMLInputElement;
    switch (name) {
      case 'fullName': {
        setFullName(target.value);
        break;
      }
      case 'email': {
        setEmail(target.value);
        break;
      }
      case 'username': {
        setUsername(target.value);
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
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // console.log(userCred);

        if (db != null) {
          await createNewUser(db, userCred.user.uid, fullName, username);
        }

        dispatch({ type: 'signIn', payload: true });
        navigate('/', { replace: true });
      } catch (err) {
        // console.log(e);
        setErrorMessage((err as FirebaseError).message);
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
              type='email'
              aria-required='true'
              required
              placeholder='Email'
              onChange={handleChange('email')}
              value={email}></input>
            <input
              className='login__form-input'
              type='text'
              aria-required='true'
              required
              placeholder='Full Name'
              onChange={handleChange('fullName')}
              value={fullName}></input>

            <input
              className='login__form-input'
              type='text'
              aria-required='true'
              required
              placeholder='Username'
              onChange={handleChange('username')}
              value={username}></input>
            <input
              className='login__form-input'
              type='password'
              aria-required='true'
              required
              minLength={6}
              placeholder='Password'
              onChange={handleChange('password')}
              value={password}></input>
            <p className='error'>{errorMessage}</p>
            <button className='instagram-button login__button' type='submit'>
              Sign up
            </button>
          </form>
        </div>

        <div className={isSmall ? 'login__signup small' : 'login__signup'}>
          <span>Have an account?</span>
          <span>
            <Link className='login__signup-link' to='/login'>
              Log In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
