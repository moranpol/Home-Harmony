import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";


import './App.css';
import LoginPage from './components/loginComponent/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
