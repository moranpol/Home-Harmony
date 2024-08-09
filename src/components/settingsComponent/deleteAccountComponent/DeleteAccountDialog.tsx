import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import axios from "axios";
import React from "react";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

interface DeleteAccountDialogProps {
  userId: number;
  open: boolean;
  setUserId: React.Dispatch<React.SetStateAction<number>>;
  setIsManager: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: (isCreated: boolean) => void;
}

const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({
  userId,
  open,
  setUserId,
  setIsManager,
  onClose,
}) => {
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState("");

  const [inCorrectMessage, setInCorrectMessage] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPassword(value);
  };

  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;

    if (
      !password ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      setErrors(
        "Password must contain at least 8 characters, including uppercase and lowercase letters, special character, and numbers."
      );
      isValid = false;
    } else {
      setErrors("");
    }

    return isValid;
  };

  const onSubmit = async () => {
    if (validateForm()) {
      axios
        .delete(`settings/account/delete?userId=${userId}&password=${password}`)
        .then((response) => {
          if (response.data.success) {
            setUserId(-1);
            setIsManager(false);
            localStorage.removeItem("userId");
            localStorage.removeItem("isManager");
            alert("You have successfully deleted your account.");
            navigate("/login");
          }
          if (response.status === 401) {
            setInCorrectMessage("Incorrect password");
          } else {
            alert("Error deleting account" + response.data.error);
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            setInCorrectMessage("Incorrect password");
          } else {
            alert("Error deleting account: " + error.response.data.error);
          }
        });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setPassword("");
        setErrors("");
        setInCorrectMessage("");
        onClose(false);
      }}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <DialogTitle
        style={{
          textAlign: "center",
          color: "#333333",
          fontSize: "2rem",
          letterSpacing: "0.125rem",
          textShadow: "0.125rem 0.125rem 0.25rem rgba(0, 0, 0, 0.2)",
          position: "relative",
        }}
      >
        Delete Account
        <span
          style={{
            content: "",
            position: "absolute",
            bottom: "-0.1rem",
            left: "50%",
            transform: "translateX(-50%)",
            width: "5rem",
            height: "0.1875rem",
            backgroundColor: "#C3A6A0",
            borderRadius: "0.125rem",
          }}
        />
      </DialogTitle>
      <DialogContent
        style={{
          width: "100%",
          maxWidth: "37.5rem",
          padding: "2rem",
          boxSizing: "border-box",
          overflow: "visible",
        }}
      >
        <Typography
          variant="body1"
          style={{
            color: "black",
            textAlign: "left",
            marginBottom: "1rem",
          }}
        >
          Are you sure you want to delete your account?
          <br />
          This action cannot be undone.
          <br />
          Please enter your password to confirm.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              onChange={onChange}
              value={password}
              error={Boolean(errors)}
              helperText={errors}
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
        </Grid>
        {inCorrectMessage && (
          <Typography
            variant="body1"
            style={{
              color: "red",
              textAlign: "left",
              marginTop: "1rem",
            }}
          >
            {inCorrectMessage}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setPassword("");
            setErrors("");
            setInCorrectMessage("");
            onClose(false);
          }}
          style={{
            textTransform: "none",
            border: "none",
            borderRadius: "0.3125rem",
            cursor: "pointer",
            fontWeight: "500",
            transition: "background-color 0.3s ease",
            color: "#C3A6A0",
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={onSubmit}
          style={{
            textTransform: "none",
            border: "none",
            borderRadius: "0.3125rem",
            cursor: "pointer",
            fontWeight: "500",
            transition: "background-color 0.3s ease",
            color: "#C3A6A0",
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAccountDialog;
