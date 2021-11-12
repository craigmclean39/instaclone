import { useEffect } from 'react';
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
import { getUserInfoFromDb } from './utilities/FirestoreHelpers';

const initialState: AppContextType = {
  currentPage: Page.HomePage,
  userInfo: null,
  signedIn: false,
  db: null,
  auth: null,
};

/* const test2 = async (firestoreDb: Firestore) => {
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
}; */

function App(): JSX.Element {
  const [appContext, appContextDispatch] = useReducer(
    appContextReducer,
    initialState
  );

  const { db, auth } = useFirebase();
  const navigate = useNavigate();

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
  } else {
    return <></>;
  }
}

export default App;
