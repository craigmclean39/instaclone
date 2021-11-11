import React, { useEffect } from 'react';
import Header from './components/Header/Header';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Profile from './pages/Profile';
import {
  AppContext,
  AppContextActionType,
  AppContextType,
  Page,
} from './Context/AppContext';
import { useReducer } from 'react';
import { appContextReducer } from './Context/AppContext';
import { useFirebase } from './hooks/useFirebase';
import UserInfoType from './types/userInfoType';

import {
  collection,
  query,
  where,
  getDocs,
  Firestore,
  doc,
  getDoc,
} from '@firebase/firestore';

import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { Dispatch } from 'react';
import LogIn from './components/Login/LogIn';
import SignUp from './components/Login/SignUp';
import { onAuthStateChanged } from '@firebase/auth';

const initialState: AppContextType = {
  currentPage: Page.HomePage,
  userInfo: null,
  signedIn: false,
  db: null,
  auth: null,
};

const getUserInfoFromDb = async (
  uid: string,
  db: Firestore,
  dispatch: Dispatch<AppContextActionType>
) => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data());
    const userData = docSnap.data();
    const userInfo: UserInfoType = {
      userId: userData.userId,
      userName: userData.userName,
      userNickname: userData.userNickname,
      userProfilePic: userData.userProfilePic,
      followers: userData.followers ? userData.followers : [],
      following: userData.following ? userData.following : [],
      description: userData.description,
    };

    if (userInfo.userProfilePic !== '') {
      const storage = getStorage();
      const imageRef = ref(storage, `${userInfo.userProfilePic}.jpg`);
      const dlUrl = await getDownloadURL(imageRef);
      userInfo.userProfilePic = dlUrl;
    }

    dispatch({ type: 'updateUserInfo', payload: userInfo });
  }
};

const test2 = async (firestoreDb: Firestore) => {
  const ref1 = collection(firestoreDb, 'posts');
  const q = query(ref1, where('userid', '==', '1234'));
  const querySnapshot = await getDocs(q);

  const storage = getStorage();

  querySnapshot.forEach((doc) => {
    console.log(doc.data());
    const imageRef = ref(storage, `${doc.data().id}.jpg`);
    const dlUrl = getDownloadURL(imageRef);
    console.log({ dlUrl });
  });
};

function App(): JSX.Element {
  const [appContext, appContextDispatch] = useReducer(
    appContextReducer,
    initialState
  );

  const { db, auth } = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('USEEFFECT');
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

  return (
    <AppContext.Provider value={appContext}>
      {appContext.signedIn ? <Header /> : null}
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
}

export default App;
