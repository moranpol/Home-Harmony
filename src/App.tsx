import React, {useEffect, useState} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/loginComponent/LoginPage";
import SignUp from "./components/signUpComponent/SignUpPage";
import HomePage from "./components/homeComponent/HomePage";
import ExpensesPage from "./components/expensesComponent/ExpensesPage";
import ConfirmPage from "./components/signUpComponent/ConfirmPage";
import DocumentsPage from "./components/documentsComponent/DocumentsPage";
import ApartmentsPage from "./components/apartmentsComponent/ApartmentsPage";

<<<<<<< HEAD
function AppWrapper({userId, setUserId} : {userId: number, setUserId: React.Dispatch<React.SetStateAction<number>>}) {
  if (userId === -1) {
    return <LoginPage setUserId={setUserId}/>
  }
=======

>>>>>>> 57ad7f46bb263b6965ffdd1ab65fb7c5f69b2103


function App() {
  const [userId, setUserId] = useState(-1);

  function AppWrapper({userId, setUserId} : {userId: number, setUserId: React.Dispatch<React.SetStateAction<number>>}) {
    if (userId === -1) {
      return <LoginPage setUserId={setUserId}/>
    }
  
    return <HomePage userId={userId}/>;
  }
  
  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) {
      console.log("retrieved previous userId: ", savedUserId);
      setUserId(Number(savedUserId));
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppWrapper userId={userId} setUserId={setUserId}/>}/>
        <Route path="/login" element={<LoginPage setUserId={setUserId}/>} />
        <Route path="/signup" element={<SignUp setUserId={setUserId}/>} />
        <Route path="/home" element={<HomePage userId={userId}/>} />
        <Route path="/expenses" element={<ExpensesPage userId={userId} />} />
        <Route path="/signup/confirm" element={<ConfirmPage userId={userId}/>} />
        <Route path="/documents" element={<DocumentsPage userId={userId}/>} />
        <Route path="/join-apartment" element={<ApartmentsPage userId={userId}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
