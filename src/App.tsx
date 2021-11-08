import React from 'react';
import Header from './components/Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Explore from './pages/Explore';

function App(): JSX.Element {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='explore' element={<Explore />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
