import React from 'react';
import Header from './components/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Explore from './pages/Explore';
import { AppContext, AppContextType, Page } from './Context/AppContext';
import { useReducer } from 'react';
import { appContextReducer } from './Context/AppContext';

const initialState: AppContextType = {
  currentPage: Page.HomePage,
};

function App(): JSX.Element {
  const [appContext, appContextDispatch] = useReducer(
    appContextReducer,
    initialState
  );

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
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    </>
  );
}

export default App;
