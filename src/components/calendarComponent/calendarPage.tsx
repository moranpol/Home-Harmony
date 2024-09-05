import React, { useCallback, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress, Typography } from "@mui/material";
import { format } from "date-fns";
import EventForm from "./AddEventForm";
import EditEventForm from "./EditEventForm";
import "./CalendarPage.css";

export interface Event {
  id: number;
  title: string;
  description: string;
  start: string;
  end: string;
}

function CalendarPage({
  userId,
  isManager,
}: {
  userId: number;
  isManager: boolean;
}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [ShowEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAllEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/calendar/${userId}`);
      setEvents(response.data);
    } catch (error: any) {
      console.error("Failed to fetch calendar:", error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const handleAddEventClick = () => {
    setSelectedEvent(null);
    setShowEditForm(false);
    setShowAddForm(true);
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

  const handleEditEvent = () => {
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleEventAdded = () => {
    handleFormClose();
  };

  const handleEventClick = (clickInfo: any) => {
    const event = events.find((e) => e.id === parseInt(clickInfo.event.id));
    if (event) {
      setSelectedEvent(event);
    }
  };

  const handleEventDetailsClose = () => {
    setSelectedEvent(null);
  };

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  return (
    <div className="calendarContainer">
      {loading ? (
        <div className="loading-container">
          <CircularProgress />
          <Typography variant="h6" className="loading-text">
            Loading...
          </Typography>
        </div>
      ) : (
        <>
          <div className="buttonContainer">
            <button className="addEventButton" onClick={handleAddEventClick}>
              Add Event
            </button>
          </div>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={events.map((event) => ({
              id: event.id.toString(),
              title: event.title,
              start: event.start,
              end: event.end,
            }))}
            eventClick={handleEventClick}
          />
        </>
      )}

      <Dialog open={showAddForm} onClose={handleFormClose}>
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          <EventForm
            userId={userId}
            setShowAddForm={setShowAddForm}
            onEventAdded={handleEventAdded}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!selectedEvent && !ShowEditForm}
        onClose={handleEventDetailsClose}
      >
        <DialogTitle>Event Details</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <div>
              <p>
                <strong>Title:</strong> {selectedEvent.title}
              </p>
              <p>
                <strong>Description:</strong> {selectedEvent.description}
              </p>
              <p>
                <strong>Start:</strong>{" "}
                {format(new Date(selectedEvent.start), "MMMM d, yyyy, h:mm a")}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {format(new Date(selectedEvent.end), "MMMM d, yyyy, h:mm a")}
              </p>
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

export default CalendarPage;
