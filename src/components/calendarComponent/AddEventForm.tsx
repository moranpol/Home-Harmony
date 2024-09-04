import axios from "axios";
import React, { useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

function AddEventForm({
  userId,
  setShowAddForm,
  onEventAdded,
}: {
  userId: number;
  setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
  onEventAdded: () => void;
}) {
  const [eventInfo, setEventInfo] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    notifyBeforeHour: false,
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
  });

  const validateForm = () => {
    const newErrors = { ...errors };
    let isValid = true;

    if (!eventInfo.title.trim()) {
      newErrors.title = "Title is required.";
      isValid = false;
    } else {
      newErrors.title = "";
    }

    if (!eventInfo.start.trim()) {
      newErrors.start = "Start time is required.";
      isValid = false;
    } else {
      newErrors.start = "";
    }

    if (!eventInfo.end.trim()) {
      newErrors.end = "End time is required.";
      isValid = false;
    } else if (new Date(eventInfo.start) >= new Date(eventInfo.end)) {
      newErrors.end = "End time must be after the start time.";
      isValid = false;
    } else {
      newErrors.end = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form submitted");
    if (validateForm()) {
      axios
        .post("/calendar/add", {
          userId: userId,
          title: eventInfo.title,
          description: eventInfo.description,
          start: eventInfo.start,
          end: eventInfo.end,
          notifyBeforeHour: eventInfo.notifyBeforeHour,
        })
        .then((response) => {
          console.log("Event added successfully");
          console.log("Response: ", response.data);
          onEventAdded();
          setShowAddForm(false);
        })
        .catch((error) => {
          console.error("Failed to add event:", error.message);
        });
    }
  };

  return (
    <Dialog
      open={true}
      onClose={() => setShowAddForm(false)}
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
        Add Event
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
              type="text"
              value={eventInfo.title}
              error={Boolean(errors.title)}
              helperText={errors.title}
              onChange={(e) =>
                setEventInfo({ ...eventInfo, title: e.target.value })
              }
              style={{ marginBottom: "1rem", width: "100%" }}
              autoComplete="title"
              name="title"
              required
              fullWidth
              multiline
              id="title"
              label="Title"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              value={eventInfo.description}
              error={Boolean(errors.description)}
              helperText={errors.description}
              onChange={(e) =>
                setEventInfo({ ...eventInfo, description: e.target.value })
              }
              style={{ marginBottom: "1rem", width: "100%" }}
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
            <TextField
              type="datetime-local"
              value={eventInfo.start}
              error={Boolean(errors.start)}
              helperText={errors.start}
              onChange={(e) =>
                setEventInfo({ ...eventInfo, start: e.target.value })
              }
              style={{ marginBottom: "1rem", width: "100%" }}
              autoComplete="start"
              name="start"
              required
              fullWidth
              id="start"
              label="Start Date & Time"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="datetime-local"
              value={eventInfo.end}
              error={Boolean(errors.end)}
              helperText={errors.end}
              onChange={(e) =>
                setEventInfo({ ...eventInfo, end: e.target.value })
              }
              style={{ width: "100%" }}
              autoComplete="end"
              name="end"
              required
              fullWidth
              id="end"
              label="End Date & Time"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={eventInfo.notifyBeforeHour}
                  onChange={(e) =>
                    setEventInfo({
                      ...eventInfo,
                      notifyBeforeHour: e.target.checked,
                    })
                  }
                  color="primary"
                />
              }
              style={{ marginBottom: "0rem" }}
              label="Send notification an hour before the event"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setShowAddForm(false)}
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
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddEventForm;
