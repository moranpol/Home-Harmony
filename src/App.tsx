import React, {useState} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import LoginPage from "./components/loginComponent/LoginPage";
import SignUp from "./components/signUpComponent/SignUpPage";
import HomePage from "./components/homeComponent/HomePage";
import ExpensesPage from "./components/expensesComponent/ExpensesPage";
import ConfirmPage from "./components/signUpComponent/ConfirmPage";


function App() {
  const [userId, setUserId] = useState(-1);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage setUserId={setUserId}/>}/>
        <Route path="/login" element={<LoginPage setUserId={setUserId}/>} />
        <Route path="/signup" element={<SignUp setUserId={setUserId}/>} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/expenses" element={<ExpensesPage userId={userId} />} />
        <Route path="/signup/confirm" element={<ConfirmPage userId={userId}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
