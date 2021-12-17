import { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import { AppContext, AppContextType, Page } from './Context/AppContext';
import { useReducer } from 'react';
import { appContextReducer } from './Context/AppContext';
import { useFirebase } from './hooks/useFirebase';

import { Firestore } from '@firebase/firestore';

import LogIn from './components/Login/LogIn';
import SignUp from './components/Login/SignUp';
import { onAuthStateChanged } from '@firebase/auth';
import { getUsersInfoFromDb, uploadPost } from './utilities/FirestoreHelpers';
import AddPost from './components/AddPost/AddPost';
import NonUserProfile from './pages/NonUserProfile';
import PostPage from './pages/PostPage';

const initialState: AppContextType = {
  currentPage: Page.HomePage,
  userInfo: null,
  signedIn: false,
  db: null,
  auth: null,
  dispatch: () => {
    /* */
  },
  reloadUserInfo: false,
};

function App(): JSX.Element {
  const [appContext, appContextDispatch] = useReducer(
    appContextReducer,
    initialState
  );
  const { db, auth } = useFirebase();
  const navigate = useNavigate();

  const [isLoaded, setIsLoaded] = useState(false);

  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const addPost = (): void => {
    // console.log('add post');
    setShowAddPostModal(true);
  };

  const cancelAddPost = (): void => {
    // console.log('Close Add Post Modal');
    setShowAddPostModal(false);
  };

  const handleUpload = async (
    file: string,
    description: string
  ): Promise<void> => {
    if (appContext.db !== null && appContext.userInfo?.userId !== undefined) {
      await uploadPost(
        appContext.db,
        file,
        description,
        appContext.userInfo?.userId
      );
      appContextDispatch({ type: 'reloadUserInfo', payload: true });
    }
  };

  useEffect(() => {
    appContextDispatch({ type: 'setDispatch', payload: appContextDispatch });
  }, []);

  useEffect(() => {
    appContextDispatch({ type: 'setDb', payload: db });
    appContextDispatch({ type: 'setAuth', payload: auth });

    async function fetchUserInfo(uid: string) {
      const uInfo = await getUsersInfoFromDb(uid, db as Firestore);

      appContextDispatch({ type: 'signIn', payload: true });
      appContextDispatch({ type: 'updateUserInfo', payload: uInfo });
      navigate('/', { replace: true });
    }

    if (auth != null) {
      onAuthStateChanged(auth, (user) => {
        // console.log('AuthStateChange');
        if (!user) {
          // console.log('Signing Out');
          appContextDispatch({ type: 'signIn', payload: false });
          appContextDispatch({ type: 'updateUserInfo', payload: null });
          navigate('/login', { replace: true });
        } else {
          // console.log('signing in');
          if (!isLoaded) {
            fetchUserInfo(user.uid);
          }
        }
      });

      setIsLoaded(true);
    }

    return () => {
      setIsLoaded(false);
    };
  }, [db, auth, navigate, isLoaded]);

  // Check if a reloadUserInfo flag has been updated and reload info as required
  useEffect(() => {
    async function fetchUserInfo(uid: string) {
      const uInfo = await getUsersInfoFromDb(uid, db as Firestore);

      appContextDispatch({ type: 'signIn', payload: true });
      appContextDispatch({ type: 'updateUserInfo', payload: uInfo });
    }

    if (appContext.reloadUserInfo) {
      // console.log('Reload User Info');
      fetchUserInfo(appContext.userInfo?.userId as string);
      appContextDispatch({ type: 'reloadUserInfo', payload: false });
    }
  }, [appContext, db]);

  if (db !== null && auth !== null && isLoaded) {
    return (
      <AppContext.Provider value={appContext}>
        {showAddPostModal ? (
          <AddPost cancelAddPost={cancelAddPost} uploadPost={handleUpload} />
        ) : null}
        {appContext.signedIn ? <Header addPost={addPost} /> : null}
        <Routes>
          <Route path='/' element={<Home dispatch={appContextDispatch} />} />
          <Route
            path='explore'
            element={<Explore dispatch={appContextDispatch} />}
          />
          <Route
            path='profile'
            element={<Profile dispatch={appContextDispatch} />}
          />
          <Route
            path='/login'
            element={<LogIn dispatch={appContextDispatch} />}
          />
          <Route
            path='/signup'
            element={<SignUp dispatch={appContextDispatch} />}
          />

          <Route path='users' element={<NonUserProfile />}>
            <Route path=':uid' element={<NonUserProfile />} />
          </Route>
          <Route path='posts' element={<PostPage />}>
            <Route path=':pid' element={<PostPage />} />
          </Route>
        </Routes>
      </AppContext.Provider>
    );
  } else {
    return <></>;
  }
}
export default App;
