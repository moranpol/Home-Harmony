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
    }
    return isValid;
  };

  const onSubmit = async () => {
    if (validateForm()) {
      console.log("Submitted");
    }
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Box className="cardContainer">
      <Card className="card">
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
                color="primary"
                sx={{
                  backgroundColor: "#F8C794",
                  color: "black",
                  fontSize: "0.7rem",
                  padding: "0.7rem 1rem",
                  "&:hover": { backgroundColor: "#D8AE7E" },
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
            color="primary"
            sx={{
              backgroundColor: "#F8C794",
              color: "black",
              padding: "0.7rem 2rem",
              "&:hover": { backgroundColor: "#D8AE7E" },
            }}
          >
            Submit
          </Button>
        </CardActions>
      </Card>
      <AddApartmentDialog
        userId={userId}
        open={dialogOpen}
        onClose={handleDialogClose}
      />
    </Box>
  );
}

export default ApartmentsPage;
