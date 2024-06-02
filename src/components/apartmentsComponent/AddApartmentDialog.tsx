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

interface AddApartmentDialogProps {
  userId: number;
  open: boolean;
  onClose: (isCreated: boolean) => void;
}

const AddApartmentDialog: React.FC<AddApartmentDialogProps> = ({
  userId,
  open,
  onClose,
}) => {
  const [apartmentInfo, setApartmentInfo] = useState({
    address: "",
    name: "",
  });

  const [errors, setErrors] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApartmentInfo({ ...apartmentInfo, [name]: value });
  };

  const validateForm = (): boolean => {
    let isValid: boolean = true;
    if (!apartmentInfo.address || apartmentInfo.address.split(" ").length < 3) {
      setErrors(
        "Address is required and should contain at least 3 words(street, number and city)."
      );
      isValid = false;
    }
    return isValid;
  };

  const onSubmit = async () => {
    if (validateForm()) {
      axios
        .post("/apartments/create", { ...apartmentInfo, userId })
        .then((res) => {
          if (res.data.success) {
            console.log("Apartment created");
            onClose(true);
          } else {
            alert("Apartment creation failed, please try again.");
          }
        })
        .catch((error: any) => {
          console.log("Apartment creation failed", error);
          alert("Apartment creation failed, please try again.");
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
        Create Apartment
        <span
          style={{
            content: "",
            position: "absolute",
            bottom: "-0.625rem",
            left: "50%",
            transform: "translateX(-50%)",
            width: "5rem",
            height: "0.1875rem",
            backgroundColor: "#f8c794",
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
              value={apartmentInfo.address}
              error={Boolean(errors)}
              helperText={errors}
              style={{ marginBottom: "1rem", width: "100%" }}
              autoComplete="street-address"
              name="address"
              required
              fullWidth
              id="address"
              label="Address"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              onChange={onChange}
              value={apartmentInfo.name}
              style={{ marginBottom: "1rem", width: "100%" }}
              autoComplete="apartment-name"
              name="name"
              fullWidth
              id="name"
              label="Apartment Name"
              InputLabelProps={{ shrink: true }}
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
            color: "#f8c794",
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
            color: "#f8c794",
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddApartmentDialog;
