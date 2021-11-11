// FIREBASE
import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';
import { Firestore } from '@firebase/firestore';
import { Auth, getAuth } from '@firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDmKG6Vua6FJNJGL0rWuqkd7x3GnpuMNVM',
  authDomain: 'instaclone-5f010.firebaseapp.com',
  projectId: 'instaclone-5f010',
  storageBucket: 'instaclone-5f010.appspot.com',
  messagingSenderId: '415999378036',
  appId: '1:415999378036:web:e7e09f165af03a6a8b8721',
};

interface userFirebaseReturnValue {
  db: Firestore | null;
  auth: Auth | null;
}

const useFirebase = (): userFirebaseReturnValue => {
  //const authStateObserver = useRef(authStateObserverCallback);
  const [db, setDb] = useState<Firestore | null>(null);
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    initializeApp(firebaseConfig);
    setDb(getFirestore());
    setAuth(getAuth());
  }, []);

  return {
    db,
    auth,
  };
};

export { useFirebase };
