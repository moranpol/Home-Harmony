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

function ApartmentsPage({ userId }: { userId: number }) {
  const [aptId, setAptId] = useState("");
  const [errors, setErrors] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const navigate = useNavigate();

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

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = (isCreated: boolean) => {
    setDialogOpen(false);

    if (isCreated) {
      alert("Apartment created successfully, welcome to your new apartment.");
      navigate("/home");
    }
  };

  return (
    <Box className="cardContainer">
      <Card className="card" sx={{ maxWidth: "36rem" }}>
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
                onClick={handleDialogOpen}
                className="button"
                variant="contained"
                sx={{
                  backgroundColor: "#C3A6A0",
                  color: "black",
                  fontSize: "0.7rem",
                  padding: "0.7rem 1rem",
                  "&:hover": { backgroundColor: "#8a7874" },
                }}
              >
                Create Apartment
              </Button>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button
            onClick={onSubmit}
            className="button"
            type="submit"
            variant="contained"
            sx={{
              marginTop: "1rem",
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
      <AddApartmentDialog
        userId={userId}
        open={dialogOpen}
        onClose={(isCreated: boolean) => {
          handleDialogClose(isCreated);
        }}
      />
    </Box>
  );
}

export default ApartmentsPage;
