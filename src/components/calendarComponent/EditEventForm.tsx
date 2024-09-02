import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';
import './EventForm.css'; 
import {Event} from './calendarPage';

interface EditEventFormProps {
    rowinfo: Event;
    userId: number;
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
    onEventEdited: () => void;
  }
  
  function EditEventForm({ rowinfo, userId, setShowForm, onEventEdited }: EditEventFormProps) {
    const [eventInfo, setEventInfo] = useState({
      id: rowinfo.id,
      userId: userId,
      title: rowinfo.title,
      description: rowinfo.description,
      start: rowinfo.start,
      end: rowinfo.end,
    });
  
    const [errors, setErrors] = useState({
      title: "",
      description: "",
      start: "",
      end: "",
    });
  
    /*
    useEffect(() => {
      setEventInfo({
        ...eventInfo,
        start: rowinfo.start,
        end: rowinfo.end,
      });
    }, [rowinfo]);
    */
  
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
        newErrors.start = 'Start time is required.';
        isValid = false;
      } else {
        newErrors.start = '';
      }
  
      if (!eventInfo.end.trim()) {
        newErrors.end = 'End time is required.';
        isValid = false;
      } else if (new Date(eventInfo.start) >= new Date(eventInfo.end)) {
        newErrors.end = 'End time must be after the start time.';
        isValid = false;
      } else {
        newErrors.end = '';
      }
  
      setErrors(newErrors);
      return isValid;
    };
  
    const handleEdit = async (event: React.FormEvent) => {
      event.preventDefault();
      console.log("Form edited eventInfo", eventInfo);
      if (validateForm()) {
         axios.post(`/calendar/edit`, { //
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
      <form onSubmit={handleEdit}>
        <label>
          Title:
          <TextField
            type="text"
            value={eventInfo.title}
            error={Boolean(errors.title)}
            helperText={errors.title}
            onChange={(e) => setEventInfo({ ...eventInfo, title: e.target.value })}
          />
        </label>
        <label>
          Description:
          <TextField
            type="text"
            value={eventInfo.description}
            error={Boolean(errors.description)}
            helperText={errors.description}
            onChange={(e) => setEventInfo({ ...eventInfo, description: e.target.value })}
          />
        </label>
        <label>
          Start Date & Time:
          <TextField
            type="datetime-local"
            value={eventInfo.start.substring(0, 16)}
            error={Boolean(errors.start)}
            helperText={errors.start}
            onChange={(e) => setEventInfo({ ...eventInfo, start: e.target.value })}
          />
        </label>
        <label>
          End Date & Time:
          <TextField
            type="datetime-local"
            value={eventInfo.end.substring(0, 16)}
            error={Boolean(errors.end)}
            helperText={errors.end}
            onChange={(e) => setEventInfo({ ...eventInfo, end: e.target.value })}
          />
        </label>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
        <Button onClick={() => setShowForm(false)} variant="outlined" color="secondary">
          Cancel
        </Button>
      </form>
    );
  }
  
  export default EditEventForm;