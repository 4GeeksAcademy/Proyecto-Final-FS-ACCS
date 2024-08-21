import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [timezone, setTimezone] = useState('');
  const [attendees, setAttendees] = useState('');
  const [eventIdToUpdate, setEventIdToUpdate] = useState('');
  const [updateSummary, setUpdateSummary] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${process.env.BACKEND_URL}api/events`, { params: { max_results: 10 } });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleCreateEvent = async () => {
    try {
      await axios.post(`${process.env.BACKEND_URL}api/events`, {
        summary,
        start_time: startTime,
        end_time: endTime,
        timezone,
        attendees: attendees.split(',')
      });
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleUpdateEvent = async () => {
    try {
      await axios.put(`${process.env.BACKEND_URL}api/events/${eventIdToUpdate}`, {
        summary: updateSummary
      });
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`${process.env.BACKEND_URL}api/events/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div>
      <h1>Google Calendar API with React</h1>

      <h2>Create Event</h2>
      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <input
        type="datetime-local"
        placeholder="Start Time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <input
        type="datetime-local"
        placeholder="End Time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <input
        type="text"
        placeholder="Timezone"
        value={timezone}
        onChange={(e) => setTimezone(e.target.value)}
      />
      <input
        type="text"
        placeholder="Attendees (comma separated)"
        value={attendees}
        onChange={(e) => setAttendees(e.target.value)}
      />
      <button onClick={handleCreateEvent}>Create Event</button>

      <h2>Update Event</h2>
      <input
        type="text"
        placeholder="Event ID to update"
        value={eventIdToUpdate}
        onChange={(e) => setEventIdToUpdate(e.target.value)}
      />
      <input
        type="text"
        placeholder="New Summary"
        value={updateSummary}
        onChange={(e) => setUpdateSummary(e.target.value)}
      />
      <button onClick={handleUpdateEvent}>Update Event</button>

      <h2>Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.summary} ({event.start.dateTime || event.start.date})
            <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
