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

export interface LogInProps {
  dispatch(o: AppContextActionType): void;
}

/* const auth = getAuth();
signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  }); */

const LogIn: React.FC<LogInProps> = ({ dispatch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    dispatch({ type: 'changePage', payload: Page.LogInPage });
  }, [dispatch]);

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
        const userCred = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log(userCred);

        dispatch({ type: 'signIn', payload: true });
        navigate('/', { replace: true });
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div className='login-wrapper'>
      <div className='login-container'>
        <div className='login__form-container'>
          <form className='login__form' onSubmit={handleSubmit}>
            <input
              type='text'
              aria-required='true'
              required
              placeholder='Email'
              onChange={handleChange('email')}
              value={email}></input>
            <input
              type='password'
              aria-required='true'
              required
              placeholder='Password'
              onChange={handleChange('password')}
              value={password}></input>
            <button type='submit'>Log In</button>
          </form>
        </div>

        <div className='login__signup'>
          <span>Don't have an account?</span>
          <span>
            <Link to='/signup'>Sign up</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
