import React from 'react';
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

function App() {
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
              <a className="text-muted" href="#!">
                Forgot password?
              </a>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0">Don't have an account?</p>
              <MDBBtn outline className="mx-2" color="primary">
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

const handleLoginButtonClick = async () => {
  try {
    //const navigate = useNavigate();
    const email = (document.getElementById("form1") as HTMLInputElement)?.value;
    const password = (document.getElementById("form2") as HTMLInputElement)
      ?.value;
    const response = await axios.post("/api/login", {
      email: email,
      password: password,
    });
    console.log(response.data);
    if (response.data.success) {
      console.log("Login successful");
      //navigate("/home");
    } else {
    }
  } catch (error: any) {
    console.error("Login failed:", error.response.data);
    // Add logic to handle failed login (e.g., display error message)
  }
};
export default App;
