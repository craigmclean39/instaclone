import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
} from '@firebase/firestore';

import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { Dispatch } from 'react';
import LogIn from './components/Login/LogIn';
import SignUp from './components/Login/SignUp';

const initialState: AppContextType = {
  currentPage: Page.HomePage,
  userInfo: null,
  signedIn: false,
};

const getUserInfoFromDb = async (
  firestoreDb: Firestore,
  dispatch: Dispatch<AppContextActionType>
) => {
  const ref1 = collection(firestoreDb, 'users');
  const q = query(ref1, where('id', '==', '1234'));
  const querySnapshot = await getDocs(q);

  const userDoc = querySnapshot.docs[0];

  const userInfo: UserInfoType = {
    userId: userDoc.data().id,
    userName: userDoc.data().name,
    userNickname: userDoc.data().nickname,
    userProfilePic: userDoc.data().profilePic,
    followers: userDoc.data().followers ? userDoc.data().followers : [],
    following: userDoc.data().following ? userDoc.data().following : [],
    description: userDoc.data().description,
  };

  const storage = getStorage();
  const imageRef = ref(storage, `${userInfo.userProfilePic}.jpg`);
  const dlUrl = await getDownloadURL(imageRef);
  userInfo.userProfilePic = dlUrl;
  dispatch({ type: 'updateUserInfo', payload: userInfo });
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

  const { firestoreDb } = useFirebase();

  /* useEffect(() => {
    if (firestoreDb != null) {
      getUserInfoFromDb(firestoreDb, appContextDispatch);
      test2(firestoreDb);
    }
  }, [firestoreDb]); */

  return (
    <AppContext.Provider value={appContext}>
      <BrowserRouter>
        <Header />
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
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
