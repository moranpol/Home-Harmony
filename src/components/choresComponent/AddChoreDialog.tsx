import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Grid,
  Typography,
} from "@mui/material";
import axios from "axios";

interface AddChoreDialogProps {
  open: boolean;
  onClose: (isCreated: boolean) => void;
  userId: number;
}

const repeatOptions = [
  { value: "none", label: "None" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

function AddChoreDialog({ open, onClose, userId }: AddChoreDialogProps) {
  const [description, setDescription] = useState("");
  const [isRepeat, setIsRepeat] = useState(false);
  const [repeat, setRepeat] = useState("none");
  const [selectedRoommate, setSelectedRoommate] = useState<string>("");
  const [roommates, setRoommates] = useState<
    { id: number; fname: string; lname: string }[]
  >([]);
  const [errors, setErrors] = useState({
    description: "",
    selectedRoommate: "",
  });

  useEffect(() => {
    const fetchRoommates = async () => {
      try {
        const response = await axios.get(`/chores/roommates/${userId}`);
        setRoommates(response.data.roommates);
      } catch (error: any) {
        console.error("Failed to fetch roommates:", error.message);
      }
    };

    if (open) {
      fetchRoommates();
    }
  }, [open, userId]);

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleRepeatChange = (event: SelectChangeEvent) => {
    setRepeat(event.target.value);
    setIsRepeat(event.target.value !== "none");
  };

  const handleRoommateChange = (event: SelectChangeEvent) => {
    setSelectedRoommate(event.target.value);
  };

  const validateForm = (): boolean => {
    let isValid: boolean = true;
    const errorsObj: {
      description: string;
      selectedRoommate: string;
    } = {
      description: "",
      selectedRoommate: "",
    };
    if (!description) {
      errorsObj.description = "Description is required.";
      isValid = false;
    }
    if (!selectedRoommate) {
      errorsObj.selectedRoommate = "You must select a roommate";
      isValid = false;
    }

    setErrors(errorsObj);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        if (!selectedRoommate) {
          alert("Please select a roommate.");
          return;
        }

        const newChore = {
          userId: selectedRoommate,
          description,
          isRepeat,
          repeat,
        };

        const response = await axios.post("/chores", newChore);
        if (response.data.success) {
          alert("Chore added successfully.");
          onClose(true);
        } else {
          alert("Failed to add chore.");
        }
      } catch (error: any) {
        console.error("Failed to add chore:", error.message);
        alert("Failed to add chore, please try again.");
      }
    }
  };

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
        Add New Chore
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
          maxWidth: "30rem",
          padding: "1.3rem",
          boxSizing: "border-box",
          overflow: "visible",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              value={description}
              onChange={handleDescriptionChange}
              error={Boolean(errors.description)}
              helperText={errors.description}
              style={{ width: "100%" }}
              autoComplete="description"
              name="description"
              required
              fullWidth
              multiline
              id="description"
              label="Description"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Assign to</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedRoommate}
                onChange={handleRoommateChange}
                label="Assign to"
              >
                {roommates.map((roommate) => (
                  <MenuItem key={roommate.id} value={roommate.id.toString()}>
                    {roommate.fname} {roommate.lname}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {errors.selectedRoommate && (
            <Typography
              variant="body1"
              style={{
                color: "red",
                textAlign: "left",
                marginTop: "1rem",
                marginLeft: "2rem",
              }}
            >
              {errors.selectedRoommate}
            </Typography>
          )}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Repeat</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={repeat}
                onChange={handleRepeatChange}
                label="Repeat"
              >
                {repeatOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
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
          onClick={handleSubmit}
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
          Add Chore
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddChoreDialog;
