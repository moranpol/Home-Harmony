import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import logo from "../../images/logo.png";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

type LoginProps = {
  setUserId: React.Dispatch<React.SetStateAction<any>>;
}

function Login({setUserId}: LoginProps) {
  
  const navigate = useNavigate();
  const handleSignInButtonClick = () => {navigate("/SignUp");};
  const handleLoginButtonClick = async () => {
    const email = (document.getElementById("form1") as HTMLInputElement)?.value;
    const password = (document.getElementById("form2") as HTMLInputElement)?.value;
    await axios.post("/login", {email: email, password: password})
    .then((response) => {
        alert("Login successful: "+ response.data.userId);
        setUserId(response.data.userId);
        localStorage.setItem("userId", response.data.userId);
        navigate("/documents");
    })
    .catch((error) => {
        console.error("Login failed:", error.message);
        alert("Login failed. "+ error.message);
    });
  };

  return (
    <MDBContainer
      className="my-5 gradient-form"
      style={{ backgroundColor: "#D0B8A8" }}
    >
      <MDBRow>
        <MDBCol col="6" className="mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <img src={logo} style={{ width: "300px" }} alt="logo" />
            </div>

            <p>Please login to your account</p>

            <div className="mb-4">
              <label htmlFor="form1">Email address</label>
              <MDBInput id="form1" type="email" />
            </div>
            <div className="mb-4">
              <label htmlFor="form2">Password</label>
              <MDBInput id="form2" type="password" />
            </div>
            <div className="text-center pt-1 mb-5 pb-1">
              <MDBBtn
                className="mb-4 w-100 gradient-custom-2"
                onClick={handleLoginButtonClick}
              >
                Login
              </MDBBtn>
              
            </div>

            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0">Don't have an account?</p>
              <MDBBtn outline className="mx-2" color="primary" onClick={handleSignInButtonClick}>
                Sign in
              </MDBBtn>
            </div>
          </div>
        </MDBCol>

        <MDBCol col="6" className="mb-5">
          <div className="d-flex flex-column  justify-content-center gradient-custom-2 h-100 mb-4">
            <div className="text-white px-3 py-4 p-md-5 mx-md-4">
              <h4 className="mb-4">Home Harmony</h4>
              <p className="medium mb-0">
                Home Harmony is a solution designed to make life easier for
                people sharing living spaces. There's a growing need for a tool
                that can help with communication, organization, and building a
                sense of community. Home Harmony does just that. It's a platform
                that not only helps with day-to-day tasks but also aims to
                create a strong bond among roommates. Our goal is to go beyond
                just managing chores and expenses, we want to make shared living
                enjoyable and organized for everyone involved.
              </p>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}


export default Login;