import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { Typography } from '@mui/material';
import Grid from "@mui/material/Grid";
import { TextField } from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "./SignUpPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type LoginProps = {
  setUserId: React.Dispatch<React.SetStateAction<any>>;
};

function SignUp({ setUserId }: LoginProps) {
  const [registerInfo, setRegisterInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    birthday: "",
    password: "",
    confirmPassword: "",
    image: undefined as File | undefined,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthday: "",
    image: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setRegisterInfo({ ...registerInfo, image: files[0] });
    } else {
      setRegisterInfo({ ...registerInfo, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;

    if (!registerInfo.firstName.trim()) {
      newErrors.firstName = "First name is required.";
      isValid = false;
    } else {
      newErrors.firstName = "";
    }

    if (!registerInfo.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
      isValid = false;
    } else {
      newErrors.lastName = "";
    }

    if (
      !registerInfo.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerInfo.email)
    ) {
      newErrors.email = "Invalid email address.";
      isValid = false;
    } else {
      newErrors.email = "";
    }

    if (
      !registerInfo.password ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        registerInfo.password
      )
    ) {
      newErrors.password =
        "Password must contain at least 8 characters, including uppercase and lowercase letters, special character, and numbers.";
      isValid = false;
    } else {
      newErrors.password = "";
    }

    if (registerInfo.password !== registerInfo.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    } else {
      newErrors.confirmPassword = "";
    }

    const today = new Date();
    const birthDate = new Date(registerInfo.birthday);
    if (!registerInfo.birthday || birthDate >= today) {
      newErrors.birthday = "Birthday must be before today.";
      isValid = false;
    } else {
      newErrors.birthday = "";
    }

    if (!registerInfo.image) {
      newErrors.image = "Please upload an image.";
      isValid = false;
    } else {
      newErrors.image = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const navigate = useNavigate();

  const onSubmit = () => {
    if (validateForm()) {
      const formData = new FormData();
      formData.append("firstName", registerInfo.firstName);
      formData.append("lastName", registerInfo.lastName);
      formData.append("email", registerInfo.email);
      formData.append("birthday", registerInfo.birthday);
      formData.append("password", registerInfo.password);
      formData.append("image", registerInfo.image as File);

      axios
        .post("/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Response:", response.data);

          if (response.data.success) {
            console.log("Registration successful");
            setUserId(response.data.userId);
            localStorage.setItem("userId", response.data.userId);
            navigate("/SignUp/confirm");
          }
        })
        .catch((error) => {
          console.error("Registration failed:", error);

          if (error.response && error.response.status === 400) {
            alert(
              "Registration failed. This email is already registered. Please use a different email or try to login."
            );
            setRegisterInfo({ ...registerInfo, email: "" });
          } else {
            alert("An error occurred during registration, try again.");
          }
        });
    }
  };

  return (
    <Box className="cardContainer">
      <Card className="card" sx={{maxWidth: "40rem", background: "transparent" }}>
        <CardContent>
          <Typography
            component="h1"
            variant="h5"
            gutterBottom
            sx={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}
          >
            Sign Up
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                onChange={onChange}
                value={registerInfo.firstName}
                error={Boolean(errors.firstName)}
                helperText={errors.firstName}
                className="inputField"
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                multiline
                id="firstName"
                label="First Name"
                autoFocus
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                onChange={onChange}
                value={registerInfo.lastName}
                error={Boolean(errors.lastName)}
                helperText={errors.lastName}
                className="inputField"
                required
                fullWidth
                multiline
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={onChange}
                value={registerInfo.email}
                error={Boolean(errors.email)}
                helperText={errors.email}
                required
                fullWidth
                multiline
                className="inputField"
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                onChange={onChange}
                value={registerInfo.password}
                error={Boolean(errors.password)}
                helperText={errors.password}
                required
                fullWidth
                className="inputField"
                name="password"
                title="Password must contain at least 8 characters, including uppercase and lowercase letters, special character, and numbers."
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                onChange={onChange}
                value={registerInfo.confirmPassword}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                className="inputField"
                title="Password must contain at least 8 characters, including uppercase and lowercase letters, special character, and numbers."
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                autoComplete="new-password"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={onChange}
                value={registerInfo.birthday}
                error={Boolean(errors.birthday)}
                helperText={errors.birthday}
                required
                fullWidth
                className="inputField"
                name="birthday"
                label="Birthday"
                type="date"
                id="birthDateInput"
                autoComplete="birthday"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <input
                name="image"
                type="file"
                accept="image/*"
                className="fileInput"
                onChange={onChange}
                style={{ display: "none" }}
                id="image"
              />
              <label htmlFor="image" className="fileInputLabel">
                <Button
                  variant="outlined"
                  component="span"
                  className="MuiButton-root"
                >
                  {registerInfo.image ? (
                    <>
                      <span>{registerInfo.image.name}</span>
                      <IconButton
                        onClick={() =>
                          setRegisterInfo({ ...registerInfo, image: undefined })
                        }
                        edge="end"
                      >
                        <CloseIcon />
                      </IconButton>
                    </>
                  ) : (
                    "Upload Profile Picture"
                  )}
                </Button>
              </label>
              {errors.image && (
                <Typography
                  variant="caption"
                  color="error"
                  style={{ padding: "10px" }}
                >
                  {errors.image}
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            onClick={onSubmit}
            className="submitButton"
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#C3A6A0",
              color: "black",
              padding: "0.7rem 2rem",
              "&:hover": { backgroundColor: "#8a7874" },
            }}
          >
            Submit
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default SignUp;
