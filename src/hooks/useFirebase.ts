// FIREBASE
import { useRef, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';
import { Firestore } from '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDmKG6Vua6FJNJGL0rWuqkd7x3GnpuMNVM',
  authDomain: 'instaclone-5f010.firebaseapp.com',
  projectId: 'instaclone-5f010',
  storageBucket: 'instaclone-5f010.appspot.com',
  messagingSenderId: '415999378036',
  appId: '1:415999378036:web:e7e09f165af03a6a8b8721',
};

const initFirebaseAuth = (authStateObserver: any) => {
  onAuthStateChanged(getAuth(), authStateObserver);
};

const useFirebase = (authStateObserverCallback: any) => {
  //const authStateObserver = useRef(authStateObserverCallback);
  const [firestoreDb, setFirestoreDb] = useState<Firestore | null>(null);

  useEffect(() => {
    initializeApp(firebaseConfig);
    setFirestoreDb(getFirestore());
    //initFirebaseAuth(authStateObserver.current);
  }, []);

  /* async function signIn() {
    let provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
  }

  const signOutUser = () => {
    signOut(getAuth());
  };

  const getProfilePicUrl = () => {
    return getAuth().currentUser?.photoURL;
  };

  const getUserName = () => {
    return getAuth().currentUser?.displayName;
  };

  const getUserId = () => {
    return getAuth().currentUser?.uid;
  }; */

  return {
    firestoreDb,
  };
};

export { useFirebase };
