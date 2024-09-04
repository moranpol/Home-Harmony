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
} from "@mui/material";
import { Event } from "./CalendarPage";

interface EditEventFormProps {
  rowinfo: Event;
  userId: number;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  onEventEdited: () => void;
}

function EditEventForm({
  rowinfo,
  userId,
  setShowForm,
  onEventEdited,
}: EditEventFormProps) {
  const [eventInfo, setEventInfo] = useState({
    id: rowinfo.id,
    userId: userId,
    title: rowinfo.title,
    description: rowinfo.description,
    start: new Date(new Date(rowinfo.start).getTime() + 3 * 60 * 60 * 1000).toISOString().substring(0, 16), 
    end: new Date(new Date(rowinfo.end).getTime() + 3 * 60 * 60 * 1000).toISOString().substring(0, 16), 
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

  const handleEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Form edited eventInfo", eventInfo);
    if (validateForm()) {
      axios
        .post(`/calendar/edit`, {
          id: eventInfo.id,
          title: eventInfo.title,
          description: eventInfo.description,
          start: eventInfo.start,
          end: eventInfo.end,
        })
        .then((response) => {
          console.log("event edit successfully");
          console.log("Response: ", response.data);
          onEventEdited();
          setShowForm(false);
        })
        .catch((error) => {
          console.error("Failed to add expense:", error.message);
        });
    }
  };

  return (
    <Dialog
      open={true}
      onClose={() => setShowForm(false)}
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
        Edit Event
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
              value={eventInfo.start.substring(0, 16)}
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
              value={eventInfo.end.substring(0, 16)}
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
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setShowForm(false)}
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
          onClick={handleEdit}
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

export default EditEventForm;
