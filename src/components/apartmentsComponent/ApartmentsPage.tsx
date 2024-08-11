import React, { useState } from "react";
import "./ApartmentsPage.css";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import AddApartmentDialog from "./AddApartmentDialog";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteAccountDialog from "../settingsComponent/deleteAccountComponent/DeleteAccountDialog";

function ApartmentsPage({
  userId,
  setUserId,
  setIsManager,
}: {
  userId: number;
  setUserId: React.Dispatch<React.SetStateAction<number>>;
  setIsManager: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [aptId, setAptId] = useState("");
  const [errors, setErrors] = useState("");
  const [createApartmentDialogOpen, setCreateApartmentDialogOpen] =
    useState(false);
  const [IsDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] =
    useState(false);

  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAptId(value);
  };

  const validateForm = (): boolean => {
    let isValid: boolean = true;
    if (!aptId) {
      setErrors("Apartment Id is required");
      isValid = false;
    } else if (aptId.length !== 6) {
      setErrors("Apartment Id must be 6 characters");
      isValid = false;
    } else {
      setErrors("");
    }
    return isValid;
  };

  const onSubmit = async () => {
    if (validateForm()) {
      try {
        const res = await axios.put("/apartments/search", {
          apartmentId: aptId,
          userId,
        });
        if (res.data.success) {
          console.log("Apartment found");
          alert("Apartment found successfully, welcome to your new apartment.");
          navigate("/home");
        } else {
          setAptId("");
          setErrors(
            "Apartment not found, please try again or create a new apartment."
          );
          alert(
            "Apartment not found, please try again or create a new apartment."
          );
        }
      } catch (error) {
        console.log("Apartment search failed", error);
        setAptId("");
        setErrors("Apartment search failed, please try again.");
        alert("Apartment search failed, please try again.");
      }
    }
  };

  const handleCreateApartmentDialogOpen = () => {
    setCreateApartmentDialogOpen(true);
  };

  const handleCreateApartmentDialogClose = (isCreated: boolean) => {
    setCreateApartmentDialogOpen(false);

    if (isCreated) {
      alert("Apartment created successfully, welcome to your new apartment.");
      navigate("/home");
    }
  };

  function handleDeleteAccountDialogOpen(): void {
    setIsDeleteAccountDialogOpen(true);
  }

  function handleDeleteAccountDialogClose(isCreated: boolean): void {
    setIsDeleteAccountDialogOpen(false);
  }

  const handleLogout = () => {
    axios
      .post("/navigate-bar/logout")
      .then((res) => {
        console.log("Logged out");
        setUserId(-1);
        setIsManager(false);
        localStorage.removeItem("userId");
        localStorage.removeItem("isManager");
        navigate("/login");
      })
      .catch((error) => {
        console.log("Failed to logout", error);
      });
  };

  return (
    <Box className="cardContainer">
      <Card
        className="card"
        sx={{
          maxWidth: "36rem",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <CardContent>
          <Typography
            component="h1"
            variant="h5"
            gutterBottom
            sx={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}
          >
            Join an Apartment
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                onChange={onChange}
                value={aptId}
                error={Boolean(errors)}
                helperText={errors}
                className="inputField"
                autoComplete="apartment-number"
                name="aptId"
                required
                fullWidth
                multiline
                id="aptId"
                label="Apartment Id"
                autoFocus
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={5}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography component="h5" gutterBottom>
                Don't have an Apartment?
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                onClick={handleCreateApartmentDialogOpen}
                className="button"
                variant="outlined"
                sx={{
                  marginRight: "1rem",
                  color: "#C3A6A0",
                  borderColor: "#C3A6A0",
                  "&:hover": { borderColor: "#8a7874", color: "#8a7874" },
                }}
              >
                Create Apartment
              </Button>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <Grid container justifyContent="center" spacing={2}>
            <Grid item>
              <Button
                onClick={onSubmit}
                className="button"
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
            </Grid>
          </Grid>
        </CardActions>
        <Grid
          container
          sx={{
            marginTop: "1rem",
            borderTop: "1px solid #C3A6A0",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Grid item>
            <Button
              onClick={handleLogout}
              variant="outlined"
              sx={{
                marginTop: "2rem",
                marginRight: "1rem",
                color: "#C3A6A0",
                borderColor: "#C3A6A0",
                "&:hover": { borderColor: "#8a7874", color: "#8a7874" },
              }}
            >
              Log Out
            </Button>
            <Button
              onClick={handleDeleteAccountDialogOpen}
              variant="outlined"
              sx={{
                marginTop: "2rem",
                color: "#C3A6A0",
                borderColor: "#C3A6A0",
                "&:hover": { borderColor: "#8a7874", color: "#8a7874" },
              }}
            >
              Delete Account
            </Button>
          </Grid>
        </Grid>
      </Card>
      <AddApartmentDialog
        userId={userId}
        open={createApartmentDialogOpen}
        onClose={(isCreated: boolean) => {
          handleCreateApartmentDialogClose(isCreated);
        }}
      />
      <DeleteAccountDialog
        open={IsDeleteAccountDialogOpen}
        onClose={(isCreated: boolean) => {
          handleDeleteAccountDialogClose(isCreated);
        }}
        userId={userId}
        setUserId={setUserId}
        setIsManager={setIsManager}
      />
    </Box>
  );
}

export default ApartmentsPage;
