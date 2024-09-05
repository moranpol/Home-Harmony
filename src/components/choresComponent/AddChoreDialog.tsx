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
  const [selectedRoommate, setSelectedRoommate] = useState<number | null>(null);
  const [roommates, setRoommates] = useState<{ id: number; fname: string; lname: string }[]>([]);

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

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleRepeatChange = (event: SelectChangeEvent) => {
    setRepeat(event.target.value);
    setIsRepeat(event.target.value !== "none");
  };

  const handleRoommateChange = (event: SelectChangeEvent) => {
    setSelectedRoommate(Number(event.target.value));
  };

  const handleSubmit = async () => {
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
        onClose(true); // Pass true to indicate the chore was successfully created
      } else {
        alert("Failed to add chore.");
      }
    } catch (error: any) {
      console.error("Failed to add chore:", error.message);
      alert("Failed to add chore, please try again.");
    }
  };

  const handleClose = () => {
    onClose(false); // Pass false to indicate no new chore was created
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Chore</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          value={description}
          onChange={handleDescriptionChange}
          required
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Assign to</InputLabel>
          <Select value={selectedRoommate?.toString() || ""} onChange={handleRoommateChange} label="Assign to">
            {roommates.map((roommate) => (
              <MenuItem key={roommate.id} value={roommate.id}>
                {roommate.fname} {roommate.lname}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Repeat</InputLabel>
          <Select value={repeat} onChange={handleRepeatChange} label="Repeat">
            {repeatOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Add Chore
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddChoreDialog;
