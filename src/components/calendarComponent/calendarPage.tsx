import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import Button from "@mui/material/Button";
import EventForm from './AddEventForm';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { format } from 'date-fns';  // Import format function
import EditEventForm from './EditEventForm';


export interface Event {
  id: number;
  title: string;
  description: string;
  start: string;
  end: string;
}


function CalendarPage({userId, isManager} : {userId: number, isManager: boolean}){
  const [events, setEvents] = useState<Event[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [ShowEditForm, setShowEditForm] = useState(false);

  const fetchAllEvents = async () => {
    await axios.get(`/calendar/${userId}`) 
    .then((response) => {
      setEvents(response.data);
    })
    .catch((error) => {
        console.error("Failed to fetch calendar:", error.message);
    });
};

  const handleAddEventClick = () => {
    console.log("clicked add");
    setSelectedEvent(null);
    setShowEditForm(false);
    setShowAddForm(true);
    console.log("showAddForm state: ", showAddForm);
  };


  const handleFormClose = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setSelectedEvent(null);

    fetchAllEvents();
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        await axios.delete(`/calendar/${selectedEvent.id}`);
        fetchAllEvents();
        setSelectedEvent(null);
      } catch (error: any) {
        console.error("Failed to delete event:", error.message);
      }
    }
  };

  /////////
  const handleEditEvent = () => {
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleEventAdded = () => {
    console.log("Event addedddddd tring close");
    handleFormClose();
  };

  const handleEventClick = (clickInfo: any) => {
    const event = events.find(e => e.id === parseInt(clickInfo.event.id));
    if (event) {
      setSelectedEvent(event);
    }
  };

  const handleEventDetailsClose = () => {
    setSelectedEvent(null);
  };

useEffect(() => {
  console.log("request events");
  fetchAllEvents();
}, [userId]);


  return (
    <div>
      <button className="addButton" onClick={handleAddEventClick}>
      Add Event
      </button>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events.map(event => ({
          id: event.id.toString(),
          title: event.title,
          start: event.start,
          end: event.end,
        }))}
        eventClick={handleEventClick}
      />
      
      <Dialog open={showAddForm} onClose={() => handleFormClose()}>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          <EventForm
            userId={userId}
            setShowAddForm={setShowAddForm}
            onEventAdded={handleEventAdded}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleFormClose()} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog open={!!selectedEvent && !ShowEditForm} onClose={handleEventDetailsClose}>
        <DialogTitle>Event Details</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <div>
              <p><strong>Title:</strong> {selectedEvent.title}</p>
              <p><strong>Description:</strong> {selectedEvent.description}</p>
              <p><strong>Start:</strong> {format(new Date(selectedEvent.start), 'MMMM d, yyyy, h:mm a')}</p>
              <p><strong>End:</strong> {format(new Date(selectedEvent.end), 'MMMM d, yyyy, h:mm a')}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
        <Button onClick={handleEditEvent} color="primary">
            Edit
          </Button>
          <Button onClick={handleDeleteEvent} color="secondary">
            Delete
          </Button>
          <Button onClick={handleEventDetailsClose} color="primary">
            Close
          </Button>
          </DialogActions>
          </Dialog>

        <Dialog open={ShowEditForm} onClose={handleEventDetailsClose}>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogContent>
            {selectedEvent && (
              <EditEventForm
                rowinfo={selectedEvent}
                userId={userId}
                setShowForm={setShowEditForm}
                onEventEdited={handleFormClose}
              />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function renderEventContent(eventInfo: any) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
      <p>{eventInfo.event.extendedProps.description}</p>
    </>
  );
}

export default CalendarPage;
