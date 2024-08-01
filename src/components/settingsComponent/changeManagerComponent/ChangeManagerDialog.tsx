import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import axios from "axios";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";

interface ChangeManagerDialogProps {
  userId: number;
  open: boolean;
  setIsManager: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: (isCreated: boolean) => void;
}

interface User {
  id: number;
  fname: string;
  lname: string;
}

const ChangeManagerDialog: React.FC<ChangeManagerDialogProps> = ({
  userId,
  open,
  setIsManager,
  onClose,
}) => {
  const [userChosen, setUserChosen] = useState<string>("");

  const [users, setUsers] = useState<User[]>([]);

  const [errors, setErrors] = useState<string>("");

  useEffect(() => {
    axios
      .get(`settings/getUsers?userId=${userId}`)
      .then((response) => {
        const data = response.data;
        const UsersList: User[] = data.map((user: any) => ({
          id: user.id,
          fname: user.fname,
          lname: user.lname,
        }));
        setUsers(UsersList);
      })
      .catch((error) => {
        console.log("Failed to retrieve users", error);
      });
  }, []);

  const onSave = async () => {
    if (userChosen === "") {
      setErrors("Please select a user.");
    } else {
      axios
        .post("settings/changeManager", {
          userId: userId,
          newManagerId: userChosen,
        })
        .then((response) => {
          setIsManager(false);
          onClose(true);
        })
        .catch((error) => {
          setErrors("Failed to change manager, try again.");
        });
    }
  };

  const handleChange = (event: SelectChangeEvent<string>): void => {
    setErrors("");
    setUserChosen(event.target.value);
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
        Change Apartment Manager
        <span
          style={{
            content: "",
            position: "absolute",
            bottom: "-0.1rem",
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
        <Typography
          variant="body1"
          style={{
            color: "black",
            textAlign: "left",
            marginBottom: "1rem",
          }}
        >
          Please select the new manager for the apartment.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">User</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={userChosen}
                label="User"
                onChange={handleChange}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.fname} {user.lname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {errors && (
          <Typography
            variant="body1"
            style={{
              color: "red",
              textAlign: "left",
              marginTop: "1rem",
            }}
          >
            {errors}
          </Typography>
        )}
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
          onClick={onSave}
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
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeManagerDialog;
