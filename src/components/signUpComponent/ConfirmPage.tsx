import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import "./SignUpPage.css";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

function ConfirmPage({ userId }: { userId: number }) {
  const [confirmationCode, setConfirmationCode] = useState("");

  const [confirmationError, setConfirmationError] = useState("");

  const validateForm = () => {
    if (confirmationCode.length > 6 || confirmationCode.length < 6) {
      setConfirmationError("Confirmation code must be 6 digits.");
      return false;
    }
  };

  const handleConfirmationCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmationCode(event.target.value);
  };

  const handleConfirm = () => {
    if (validateForm()) {
      axios
        .post("register/confirm", {
          confirmationCode: confirmationCode,
          userId: userId,
        })
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            alert("Confirmation success");
          }
        })
        .catch((error) => {
          console.error("Confirmation failed:", error.response.data);
          alert("Confirmation failed. Please try again.");
        });
    }
  };

  return (
    <Box className="cardContainer">
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card className="card">
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                sx={{ textAlign: "center", marginBottom: 4, color: "#333" }}
              >
                Confirm Your Account
              </Typography>
              <TextField
                error={Boolean(confirmationError)}
                helperText={confirmationError}
                className="inputField"
                label="Confirmation Code"
                variant="outlined"
                fullWidth
                value={confirmationCode}
                onChange={handleConfirmationCodeChange}
                InputLabelProps={{ shrink: true }}
              />
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                onClick={handleConfirm}
                className="submitButton"
                sx={{
                  backgroundColor: "#F8C794",
                  color: "black",
                  padding: "0.7rem 2rem",
                  "&:hover": { backgroundColor: "#D8AE7E" },
                }}
              >
                Confirm
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ConfirmPage;
