import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/loginComponent/LoginPage";
import SignUp from "./components/signUpComponent/SignUpPage";
import HomePage from "./components/homeComponent/HomePage";
import ExpensesPage from "./components/expensesComponent/ExpensesPage";
import ConfirmPage from "./components/signUpComponent/ConfirmPage";
import DocumentsPage from "./components/documentsComponent/DocumentsPage";
import ApartmentsPage from "./components/apartmentsComponent/ApartmentsPage";
import NavigateBar from "./components/navigateBarComponent/NavigateBar";
import SettingsPage from "./components/settingsComponent/SettingsPage";
import ChoresPage from "./components/choresComponent/ChoresPage";
import CalendarPage from "./components/calendarComponent/CalendarPage";
import axios from "axios";

//axios.defaults.baseURL = "http://54.87.10.241:5000";
axios.defaults.baseURL = "http://localhost:5000";

function App() {
  function AppWrapper({
    userId,
    setUserId,
    isManager,
    setIsManager,
  }: {
    userId: number;
    setUserId: React.Dispatch<React.SetStateAction<number>>;
    isManager: boolean;
    setIsManager: React.Dispatch<React.SetStateAction<boolean>>;
  }) {
    if (userId === -1) {
      return <LoginPage setUserId={setUserId} setIsManager={setIsManager} />;
    }

    return (
      <div>
        <NavigateBar
          userId={userId}
          setUserId={setUserId}
          isManager={isManager}
          setIsManager={setIsManager}
        />
        <HomePage userId={userId} />
      </div>
    );
  }

  const [userId, setUserId] = useState(() => {
    const savedUserId = localStorage.getItem("userId");
    const userId = savedUserId ? Number(savedUserId) : -1;
    console.log("retrieved previous userId: ", userId);
    return userId;
  });

  const [isManager, setIsManager] = useState(() => {
    const savedIsManager = localStorage.getItem("isManager");
    const isManager = savedIsManager === "true";

    console.log("retrieved previous is manager: ", isManager);
    return isManager;
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppWrapper
              userId={userId}
              setUserId={setUserId}
              isManager={isManager}
              setIsManager={setIsManager}
            />
          }
        />
        <Route
          path="/login"
          element={
            <LoginPage setUserId={setUserId} setIsManager={setIsManager} />
          }
        />
        <Route path="/signup" element={<SignUp setUserId={setUserId} />} />
        <Route
          path="/home"
          element={
            <>
              <NavigateBar
                userId={userId}
                setUserId={setUserId}
                isManager={isManager}
                setIsManager={setIsManager}
              />
              <HomePage userId={userId} />
            </>
          }
        />
        <Route
          path="/expenses"
          element={
            <>
              <NavigateBar
                userId={userId}
                setUserId={setUserId}
                isManager={isManager}
                setIsManager={setIsManager}
              />
              <ExpensesPage userId={userId} isManager={isManager} />
            </>
          }
        />
        <Route
          path="/signup/confirm"
          element={<ConfirmPage userId={userId} />}
        />
        <Route
          path="/documents"
          element={
            <>
              <NavigateBar
                userId={userId}
                setUserId={setUserId}
                isManager={isManager}
                setIsManager={setIsManager}
              />
              <DocumentsPage userId={userId} />
            </>
          }
        />
        <Route
          path="/chores"
          element={
            <>
              <NavigateBar
                userId={userId}
                setUserId={setUserId}
                isManager={isManager}
                setIsManager={setIsManager}
              />
              <ChoresPage userId={userId} isManager={isManager} />
            </>
          }
        />
        <Route
          path="/join-apartment"
          element={
            <ApartmentsPage
              userId={userId}
              setUserId={setUserId}
              setIsManager={setIsManager}
            />
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <NavigateBar
                userId={userId}
                setUserId={setUserId}
                isManager={isManager}
                setIsManager={setIsManager}
              />
              <SettingsPage
                userId={userId}
                setUserId={setUserId}
                isManager={isManager}
                setIsManager={setIsManager}
              />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <NavigateBar
                userId={userId}
                setUserId={setUserId}
                isManager={isManager}
                setIsManager={setIsManager}
              />
              <CalendarPage userId={userId} isManager={isManager} />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
