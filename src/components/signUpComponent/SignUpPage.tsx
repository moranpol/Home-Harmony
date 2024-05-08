import React from "react";
import {
  MDBInput,
  MDBContainer,
  MDBValidation,
  MDBValidationItem,
  MDBCardBody,
  MDBCard,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import "./SignUpPage.css";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

function SignUp() {
  const [registerInfo, setRegisterInfo] = React.useState({
    fname: "",
    lname: "",
    email: "",
    birthday: "",
    photo: "",
    password: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterInfo({ ...registerInfo, [e.target.name]: e.target.value });
  };

  const isEmailValid: boolean = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    registerInfo.email
  );

  const isValidPassword: boolean =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(
      registerInfo.password
    );

  const isBirthdayValid: boolean = new Date(registerInfo.birthday) < new Date();

  const isFormValid: boolean =
    Object.values(registerInfo).every((value) => value !== "") &&
    isEmailValid &&
    isValidPassword &&
    isBirthdayValid;

  const onSubmit = async () => {
    try {
      const response = await axios.post("/register", registerInfo);
      console.log("Response:", response.data);

      if (response.data.success) {
        console.log("Registration successful");
        // Optionally, perform any actions after successful registration
      }
    } catch (error: any) {
      console.error("Registration failed:", error);

      if (error.response && error.response.status === 400) {
        alert(
          "Registration failed. This email is already registered. Please use a different email or try to login."
        );
        const emailInput = document.getElementById("validationEmail");
        setRegisterInfo({ ...registerInfo, email: "" });
        if (emailInput) emailInput.focus();
      } else {
        alert("An error occurred during registration, try again.");
      }
    }
  };

  return (
    <MDBContainer fluid>
      <h1 className="text-center mt-5">Sign Up</h1>
      <MDBRow className="justify-content-center align-items-center m-3">
        <MDBCard
          style={{
            borderRadius: "25px",
          }}
        >
          <MDBCardBody className="px-4">
            <MDBValidation className="text-black" isValidated>
              <MDBRow>
                <MDBCol md="6">
                  <MDBValidationItem
                    feedback="Please enter your first name."
                    invalid
                  >
                    <label htmlFor="validationFName">First name</label>
                    <MDBInput
                      value={registerInfo.fname}
                      name="fname"
                      onChange={onChange}
                      id="validationFName"
                      required
                      type="text"
                      wrapperClass="mb-4"
                      size="lg"
                    />
                  </MDBValidationItem>
                </MDBCol>
                <MDBCol md="6">
                  <MDBValidationItem
                    feedback="Please enter your last name."
                    invalid
                  >
                    <label htmlFor="validationLName">Last name</label>
                    <MDBInput
                      value={registerInfo.lname}
                      name="lname"
                      onChange={onChange}
                      id="validationLName"
                      required
                      type="text"
                      wrapperClass="mb-4"
                      size="lg"
                    />
                  </MDBValidationItem>
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol md="6">
                  <MDBValidationItem
                    feedback="Please enter a valid email with @."
                    invalid
                  >
                    <label htmlFor="validationEmail">Email</label>
                    <MDBInput
                      value={registerInfo.email}
                      name="email"
                      onChange={onChange}
                      id="validationEmail"
                      required
                      type="email"
                      wrapperClass="mb-4"
                      size="lg"
                    />
                  </MDBValidationItem>
                </MDBCol>
                <MDBCol md="6">
                  <label htmlFor="validationPassword">Password</label>
                  <MDBValidationItem
                    feedback="Please enter a valid password."
                    invalid
                  >
                    <MDBInput
                      value={registerInfo.password}
                      name="password"
                      onChange={onChange}
                      id="validationPassword"
                      required
                      type="password"
                      size="lg"
                      title="Password must contain at least 8 characters, including uppercase, lowercase and numbers."
                    />
                  </MDBValidationItem>
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol md="6">
                  <MDBValidationItem
                    feedback="Please enter your birthday."
                    invalid
                  >
                    <label htmlFor="validationBirthday">Birthday</label>
                    <div className="form-outline datepicker">
                      <MDBInput
                        value={registerInfo.birthday}
                        name="birthday"
                        onChange={onChange}
                        id="validationBirthday"
                        required
                        type="date"
                        className="form-control"
                        wrapperClass="mb-4"
                        size="lg"
                        title="Birthday must be before today."
                      />
                    </div>
                  </MDBValidationItem>
                </MDBCol>
                <MDBCol md="6">
                  <MDBValidationItem
                    feedback="Please enter your profile image."
                    invalid
                  >
                    <label htmlFor="validationPhoto">Image</label>
                    <MDBInput
                      value={registerInfo.photo}
                      name="photo"
                      onChange={onChange}
                      id="validationPhoto"
                      required
                      type="file"
                      wrapperClass="mb-4"
                      size="lg"
                    />
                  </MDBValidationItem>
                </MDBCol>
              </MDBRow>
              <div className="col-12 d-flex justify-content-center">
                <button
                  type="submit"
                  className="submitButton"
                  disabled={!isFormValid}
                  onClick={onSubmit}
                >
                  Submit
                </button>
              </div>
            </MDBValidation>
          </MDBCardBody>
        </MDBCard>
      </MDBRow>
    </MDBContainer>
  );
}

export default SignUp;
