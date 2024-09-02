import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import './EventForm.css';

function AddEventForm({ userId, setShowAddForm, onEventAdded}: { userId: number, setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>,  onEventAdded: () => void}) {
    const [eventInfo, setEventInfo] = useState({
        title: "",
        description: "",
        start: "",
        end: ""
    });
    
    const [errors, setErrors] = useState({
        title: "",
        description: "",
        start: "",
        end: ""
    });

    const validateForm = () => {
        const newErrors = { ...errors };
        let isValid = true;

        if (!eventInfo.title.trim()) {
            newErrors.title = 'Title is required.';
            isValid = false;
          } else {
            newErrors.title = '';
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

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Form submitted");
        if (validateForm()) {
            

            axios.post('/calendar/add', {
                userId: userId,
                title: eventInfo.title,
                description: eventInfo.description,
                start: eventInfo.start,
                end: eventInfo.end,
              })
              .then((response) => {
                console.log('Event added successfully');
                console.log('Response: ', response.data);
                onEventAdded();
                setShowAddForm(false);
                console.log("finish -setShowAddForm ", setShowAddForm);
              })
              .catch((error) => {
                console.error('Failed to add event:', error.message);
              });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Title:
                <TextField
                type="text"
                value={eventInfo.title}
                error={Boolean(errors.title)}
                onChange={(e) => setEventInfo({ ...eventInfo, title: e.target.value })}
                />
            </label>
            <label>
                Description:
                <TextField
                type="text"
                value={eventInfo.description}
                error={Boolean(errors.description)}
                onChange={(e) =>
                    setEventInfo({ ...eventInfo, description: e.target.value })
                }
                />
            </label>
            <label>
                Start Date and Time:
                <TextField
                type="datetime-local"
                value={eventInfo.start}
                error={Boolean(errors.start)}
                onChange={(e) =>
                    setEventInfo({ ...eventInfo, start: e.target.value })
                }
                />
            </label>
            <label>
                End Date and Time:
                <TextField
                type="datetime-local"
                value={eventInfo.end}
                error={Boolean(errors.end)}
                onChange={(e) =>
                    setEventInfo({ ...eventInfo, end: e.target.value })
                }
                />
            </label>
            <input type="submit" value="Submit" />
            </form>
    );

}
export default AddEventForm;