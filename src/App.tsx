import React, { useEffect } from 'react';
import Header from './components/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

const initialState: AppContextType = {
  currentPage: Page.HomePage,
  userInfo: null,
};

const getUserInfoFromDb = async (
  firestoreDb: Firestore,
  dispatch: Dispatch<AppContextActionType>
) => {
  const ref = collection(firestoreDb, 'users');
  const q = query(ref, where('id', '==', '1234'));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    console.log(doc.data());

    const userInfo: UserInfoType = {
      userId: doc.data().id,
      userName: doc.data().name,
      userNickname: doc.data().nickname,
      userProfilePic: doc.data().profilePic,
    };

    dispatch({ type: 'updateUserInfo', payload: userInfo });
  });
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

  const { firestoreDb } = useFirebase(null);

  useEffect(() => {
    if (firestoreDb != null) {
      getUserInfoFromDb(firestoreDb, appContextDispatch);
      test2(firestoreDb);
    }
  }, [firestoreDb]);

  return (
    <>
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
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    </>
  );
}

export default App;
