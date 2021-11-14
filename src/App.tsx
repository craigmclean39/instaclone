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
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@firebase/storage';

import LogIn from './components/Login/LogIn';
import SignUp from './components/Login/SignUp';
import { onAuthStateChanged } from '@firebase/auth';
import {
  getUserInfoFromDb,
  addPostToPostCollection,
} from './utilities/FirestoreHelpers';
import AddPost from './components/AddPost/AddPost';
import uniqid from 'uniqid';

const initialState: AppContextType = {
  currentPage: Page.HomePage,
  userInfo: null,
  signedIn: false,
  db: null,
  auth: null,
};

function App(): JSX.Element {
  const [appContext, appContextDispatch] = useReducer(
    appContextReducer,
    initialState
  );
  const { db, auth } = useFirebase();
  const navigate = useNavigate();

  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const addPost = (): void => {
    console.log('add post');
    setShowAddPostModal(true);
  };

  const cancelAddPost = (): void => {
    setShowAddPostModal(false);
  };

  const uploadPost = async (file: File): Promise<void> => {
    const storage = getStorage();
    const fid = uniqid();
    const fileRef = ref(storage, fid);

    const p = await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(fileRef);
    addPostToPostCollection(
      db as Firestore,
      appContext.userInfo?.userId as string,
      downloadUrl
    );
  };

  useEffect(() => {
    appContextDispatch({ type: 'setDb', payload: db });
    appContextDispatch({ type: 'setAuth', payload: auth });

    if (auth != null) {
      onAuthStateChanged(auth, (user) => {
        console.log('AuthStateChange');
        if (!user) {
          console.log('Signing Out');
          appContextDispatch({ type: 'signIn', payload: false });
          navigate('/login', { replace: true });
        } else {
          console.log('signing in');

          getUserInfoFromDb(user.uid, db as Firestore, appContextDispatch);

          appContextDispatch({ type: 'signIn', payload: true });
          navigate('/', { replace: true });
        }
      });
    }
  }, [db, auth]);

  if (db !== null && auth !== null) {
    return (
      <AppContext.Provider value={appContext}>
        {showAddPostModal ? (
          <AddPost cancelAddPost={cancelAddPost} uploadPost={uploadPost} />
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
        </Routes>
      </AppContext.Provider>
    );
  } else {
    return <></>;
  }
}

export default App;
