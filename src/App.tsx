import React, {useEffect, useState} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import LoginPage from "./components/loginComponent/LoginPage";
import SignUp from "./components/signUpComponent/SignUpPage";
import HomePage from "./components/homeComponent/HomePage";
import ExpensesPage from "./components/expensesComponent/ExpensesPage";
import ConfirmPage from "./components/signUpComponent/ConfirmPage";


function AppWrapper({userId, setUserId} : {userId: number, setUserId: React.Dispatch<React.SetStateAction<number>>}) {
  if (userId === -1) {
    return <LoginPage setUserId={setUserId}/>
  }

  return <HomePage />;
}


function App() {
  const [userId, setUserId] = useState(() => {
    const savedUserId = localStorage.getItem("userId");
    const userId = savedUserId ? Number(savedUserId) : -1;
    console.log("retrieved previous userId: ", userId);
    return userId;
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppWrapper userId={userId} setUserId={setUserId}/>}/>
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
