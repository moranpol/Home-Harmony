import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import "./LoginPage.css";
import logo from "../../images/logo.png";

type LoginProps = {
  setUserId: React.Dispatch<React.SetStateAction<any>>;
  setIsManager: React.Dispatch<React.SetStateAction<any>>;
};

function Login({ setUserId, setIsManager }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState({
    email: "",
    password: "",
  });

  const handleSignInButtonClick = () => {
    navigate("/SignUp");
  };

  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address.";
      isValid = false;
    } else {
      newErrors.email = "";
    }

    if (
      !password ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      newErrors.password =
        "Must contain at least 8 characters, including uppercase, lowercase letters, special character, and numbers.";
      isValid = false;
    } else {
      newErrors.password = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLoginButtonClick = async () => {
    if (validateForm()) {
      try {
        const response = await axios.post("/login", { email, password });
        setUserId(response.data.userId);
        setIsManager(response.data.isManager);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("isManager", response.data.isManager);
        navigate("/home");
      } catch (error) {
        alert("Login failed. Invalid password or email.");
      }
    }
  };

  return (
    <Box className="cardContainer">
      <Card className="card" sx={{ maxWidth: "60rem", background: "transparent" }}>
        <Grid container>
          <Grid item xs={12} md={6} className="leftSide">
            <CardContent>
              <Typography
                component="h1"
                variant="h5"
                gutterBottom
                sx={{
                  textAlign: "center",
                  marginBottom: "2rem",
                  color: "#333",
                }}
              >
                Login
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    fullWidth
                    required
                    multiline
                    label="Email Address"
                    variant="outlined"
                    autoComplete="email"
                    className="inputField"
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                    InputLabelProps={{ shrink: true }}
                    sx={{ height: "3.5rem", marginTop: "1rem" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                    title="Password must contain at least 8 characters, including uppercase and lowercase letters, special character, and numbers."
                    fullWidth
                    required
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    variant="outlined"
                    className="inputField"
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
                    sx={{ height: "3.5rem" }}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions
              sx={{ justifyContent: "center", flexDirection: "column" }}
            >
              <Button
                onClick={handleLoginButtonClick}
                variant="contained"
                className="loginButton"
                sx={{
                  backgroundColor: "#C3A6A0",
                  color: "black",
                  padding: "0.7rem 2rem",
                  "&:hover": { backgroundColor: "#8a7874" },
                  marginTop: "1rem",
                }}
              >
                Login
              </Button>
              <Typography
                variant="body2"
                sx={{ marginTop: "2rem", fontSize: "1rem" }}
              >
                Don't have an account?{" "}
                <Button
                  onClick={handleSignInButtonClick}
                  variant="text"
                  sx={{
                    color: "#C3A6A0",
                    textDecoration: "underline",
                    padding: 0,
                  }}
                >
                  Sign Up
                </Button>
              </Typography>
            </CardActions>
          </Grid>
          <Grid item xs={12} md={6} className="rightSide">
            <Box className="logoContainer">
              <img src={logo} alt="Home Harmony Logo" className="logo" />
              <Typography
                variant="body1"
                sx={{ marginTop: "1rem", color: "#666" }}
              >
                Home Harmony is a solution designed to make life easier for
                people sharing living spaces. There's a growing need for a tool
                that can help with communication, organization, and building a
                sense of community. Home Harmony does just that. It's a platform
                that not only helps with day-to-day tasks but also aims to
                create a strong bond among roommates. Our goal is to go beyond
                just managing chores and expenses, we want to make shared living
                enjoyable and organized for everyone involved.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}

export default Login;
