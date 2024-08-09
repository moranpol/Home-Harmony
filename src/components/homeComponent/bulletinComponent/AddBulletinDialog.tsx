import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Grid } from "@mui/material";
import { useState } from "react";
import axios from "axios";

interface AddBulletinDialogProps {
  userId: number;
  open: boolean;
  onClose: (isCreated: boolean) => void;
}

const AddBulletinDialog: React.FC<AddBulletinDialogProps> = ({
  userId,
  open,
  onClose,
}) => {
  const [bulletinInfo, setBulletinInfo] = useState({
    info: "",
    date: undefined as Date | undefined,
  });

  const [errors, setErrors] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBulletinInfo({ info: value, date: new Date() });
  };

  const validateForm = (): boolean => {
    if (!bulletinInfo.info) {
      setErrors("Info cannot be empty.");
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    if (validateForm()) {
      axios
        .post("/bulletins/create", { ...bulletinInfo, userId })
        .then((res) => {
          if (res.data.success) {
            console.log("Bulletin created");
            onClose(true);
          } else {
            alert("Bulletin creation failed, please try again.");
          }
        })
        .catch((error: any) => {
          console.log("Bulletin creation failed", error);
          alert("Bulletin creation failed, please try again.");
        });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        maxWidth: "50rem", 
        margin: "auto",
      }}
    >
      <DialogTitle
        style={{
          textAlign: "center",
          color: "#333333",
          fontSize: "2.5rem",
          letterSpacing: "0.125rem",
          textShadow: "0.125rem 0.125rem 0.25rem rgba(0, 0, 0, 0.2)",
          position: "relative",
        }}
      >
        Create Bulletin
        <span
          style={{
            content: '""',
            position: "absolute",
            bottom: "-0.625rem", 
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              onChange={onChange}
              value={bulletinInfo.info}
              error={Boolean(errors)}
              helperText={errors}
              style={{
                width: "100%",
              }}
              autoComplete="bulletin-info"
              name="info"
              required
              fullWidth
              multiline
              id="info"
              label="Info"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onClose(false)}
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
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBulletinDialog;
