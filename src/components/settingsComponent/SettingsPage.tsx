import React, { useState } from "react";
import "./SettingsPage.css";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import PersonalInfoDialog from "./personalInfoComponent/PersonalInfoDialog";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteAccountDialog from "./deleteAccountComponent/DeleteAccountDialog";
import ChangeManagerDialog from "./changeManagerComponent/ChangeManagerDialog";

function SettingsPage({
  userId,
  setUserId,
  isManager,
  setIsManager,
}: {
  userId: number;
  setUserId: React.Dispatch<React.SetStateAction<number>>;
  isManager: boolean;
  setIsManager: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [IsPersonalInfoDialogOpen, setIsPersonalInfoDialogOpen] =
    useState(false);

  const [IsDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] =
    useState(false);

  const [IsChangeManagerDialogOpen, setIsChangeManagerDialogOpen] =
    useState(false);

  const handlePersonalInfoDialogOpen = () => {
    setIsPersonalInfoDialogOpen(true);
  };

  const handlePersonalInfoDialogClose = (isCreated: boolean) => {
    setIsPersonalInfoDialogOpen(false);
  };

  const navigate = useNavigate();

  function handleExitApartmentClick(): void {
    if (window.confirm("Are you sure you want to exit the apartment?")) {
      axios
        .post("settings/apartment/exit", { userId: userId })
        .then((response) => {
          if (response.data.success) {
            alert("You have successfully exited the apartment.");
            navigate("/join-apartment");
          } else {
            alert("Error exiting apartment" + response.data.error);
          }
        })
        .catch((error) => {
          console.log(error);
          alert("Error exiting apartment: " + error.response.data.error);
        });
    }
  }

  function handleDeleteAccountDialogOpen(): void {
    setIsDeleteAccountDialogOpen(true);
  }

  function handleDeleteAccountDialogClose(isCreated: boolean): void {
    setIsDeleteAccountDialogOpen(false);
  }

  function handleDeleteApartmentClick(): void {
    if (window.confirm("Are you sure you want to delete the apartment?")) {
      axios
        .delete(`settings/apartment/delete?userId=${userId}`)
        .then((response) => {
          if (response.data.success) {
            alert("You have successfully deleted the apartment.");
            navigate("/join-apartment");
          } else {
            alert("Error deleting apartment" + response.data.error);
          }
        })
        .catch((error) => {
          console.log(error);
          alert("Error deleting apartment: " + error.response.data.error);
        });
    }
  }

  function handleLogOutClick(): void {
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
  }

  function handleChangeManagerDialogOpen(): void {
    setIsChangeManagerDialogOpen(true);
  }

    function handleChangeManagerDialogClose(isCreated: boolean): void {
        setIsChangeManagerDialogOpen(false);
    }

  return (
    <Container className="settingsContainer">
      <Typography
        component="h1"
        variant="h5"
        className="settingsTypography"
        gutterBottom
        sx={{
          textAlign: "center",
          marginBottom: "2rem",
          marginTop: "2rem",
          color: "#333",
        }}
      >
        Settings
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} className="settingsGrid">
          <Button
            variant="contained"
            className="settingsButton"
            onClick={handlePersonalInfoDialogOpen}
          >
            Personal Info
          </Button>
        </Grid>
        <Grid item xs={12} className="settingsGrid">
          <Button
            variant="contained"
            className="settingsButton"
            onClick={handleExitApartmentClick}
          >
            Exit Apartment
          </Button>
        </Grid>
        {isManager && (
          <>
            <Grid item xs={12} className="settingsGrid">
              <Button
                variant="contained"
                className="settingsButton"
                onClick={handleChangeManagerDialogOpen}
              >
                Change Manager
              </Button>
            </Grid>
            <Grid item xs={12} className="settingsGrid">
              <Button
                variant="contained"
                className="settingsButton"
                onClick={handleDeleteApartmentClick}
              >
                Delete Apartment
              </Button>
            </Grid>
          </>
        )}
        <Grid item xs={12} className="settingsGrid">
          <Button
            variant="contained"
            className="settingsButton"
            onClick={handleDeleteAccountDialogOpen}
          >
            Delete Account
          </Button>
        </Grid>
        <Grid item xs={12} className="settingsGrid">
          <Button
            variant="contained"
            className="settingsButton"
            onClick={handleLogOutClick}
          >
            Log Out
          </Button>
        </Grid>
      </Grid>
      <PersonalInfoDialog
        userId={userId}
        open={IsPersonalInfoDialogOpen}
        onClose={handlePersonalInfoDialogClose}
      />
      <DeleteAccountDialog
        userId={userId}
        open={IsDeleteAccountDialogOpen}
        setUserId={setUserId}
        setIsManager={setIsManager}
        onClose={handleDeleteAccountDialogClose}
      />
      <ChangeManagerDialog
        userId={userId}
        open={IsChangeManagerDialogOpen}
        setIsManager={setIsManager}
        onClose={handleChangeManagerDialogClose}
        />
    </Container>
  );
}

export default SettingsPage;
