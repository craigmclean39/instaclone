import { AppContextActionType, Page } from '../../Context/AppContext';
import { SyntheticEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { createNewUser } from '../../utilities/FirestoreHelpers';
import { useFirebase } from '../../hooks/useFirebase';
import { useFirestore } from '../../hooks/useFirestore';

export interface SignUpProps {
  dispatch(o: AppContextActionType): void;
}

const SignUp: React.FC<SignUpProps> = ({ dispatch }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    dispatch({ type: 'changePage', payload: Page.SignUpPage });
  }, [dispatch]);

  const { auth } = useAuth();
  const { db } = useFirestore();
  const navigate = useNavigate();

  const handleChange = (name: string) => (e: SyntheticEvent) => {
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
        console.log(userCred);

        //TODO: After successful user creation, create a new entry in the firestore users collection with additional info

        if (db != null) {
          await createNewUser(db, userCred.user.uid, fullName, username);
        }

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
              type='text'
              aria-required='true'
              required
              placeholder='Full Name'
              onChange={handleChange('fullName')}
              value={fullName}></input>

            <input
              type='text'
              aria-required='true'
              required
              placeholder='Username'
              onChange={handleChange('username')}
              value={username}></input>
            <input
              type='password'
              aria-required='true'
              required
              minLength={6}
              placeholder='Password'
              onChange={handleChange('password')}
              value={password}></input>
            <button type='submit'>Sign up</button>
          </form>
        </div>

        <div className='login__signup'>
          <span>Have an account?</span>
          <span>
            <Link to='/login'>Log In</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
