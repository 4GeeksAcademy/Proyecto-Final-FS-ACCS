import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import ApiCalendar from 'react-google-calendar-api';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Button, Form } from 'react-bootstrap'; 

const CLIENT_ID = "1059256211415-jqr22lfih5jre0cl0nbmhi7bd0q55cf0.apps.googleusercontent.com";
const config = {
    "clientId": CLIENT_ID,
    "apiKey": "AIzaSyAmENulZCGuDqNtkl8lxROSMdp1O5gJeKM",
    "scope": "https://www.googleapis.com/auth/calendar",
    "discoveryDocs": [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
    ]
};

const apiCalendar = new ApiCalendar(config);
const localizer = momentLocalizer(moment);

export const GoogleCalendar = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'delete'

    useEffect(() => {
        if (isSignedIn) {
            fetchEvents();
        }
    }, [isSignedIn]);

    const fetchEvents = async () => {
        try {
            let response = await apiCalendar.listEvents({
                showDeleted: false,
                maxResults: 10,
            });
            const googleEvents = response.result.items.map(event => ({
                id: event.id,
                title: event.summary,
                start: new Date(event.start.dateTime || event.start.date),
                end: new Date(event.end.dateTime || event.end.date),
            }));
            setEvents(googleEvents);
        } catch (error) {
            console.error("Error fetching events: ", error);
        }
    };

    const handleSignIn = async () => {
        try {
            let response = await apiCalendar.handleAuthClick();
            if (response.access_token) {
                setIsSignedIn(true);
            }
        } catch (error) {
            console.error("Error during sign-in: ", error);
        }
    };

    const handleSignOut = () => {
        apiCalendar.handleSignoutClick();
        setIsSignedIn(false);
        setEvents([]);
    };

    const handleAddEvent = async () => {
        if (!isSignedIn) return alert('Please sign in first');

        const event = {
            summary: 'New Event',
            start: {
                dateTime: new Date(),
                timeZone: 'America/Los_Angeles',
            },
            end: {
                dateTime: new Date(new Date().getTime() + 60 * 60 * 1000),
                timeZone: 'America/Los_Angeles',
            },
        };

        try {
            await apiCalendar.createEvent(event);
            fetchEvents(); // Refresh the events list after adding a new one
        } catch (error) {
            console.error("Error adding event: ", error);
        }
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setModalMode('view');
        setShowModal(true);
    };

    const handleEditEvent = async () => {
        if (!isSignedIn || !selectedEvent) return;

        const updatedEvent = {
            summary: selectedEvent.title,
            start: {
                dateTime: selectedEvent.start.toISOString(),
                timeZone: 'America/Los_Angeles',
            },
            end: {
                dateTime: selectedEvent.end.toISOString(),
                timeZone: 'America/Los_Angeles',
            },
        };

        try {
            await apiCalendar.updateEvent(selectedEvent.id, updatedEvent);
            fetchEvents();
            setShowModal(false);
        } catch (error) {
            console.error("Error updating event: ", error);
        }
    };

    const handleDeleteEvent = async () => {
        if (!isSignedIn || !selectedEvent) return;

        try {
            await apiCalendar.deleteEvent(selectedEvent.id);
            fetchEvents();
            setShowModal(false);
        } catch (error) {
            console.error("Error deleting event: ", error);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <div>
                <button onClick={handleSignIn}>Sign In</button>
                <button onClick={handleSignOut}>Sign Out</button>
                <button onClick={handleAddEvent}>Add Event</button>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, margin: "50px" }}
                    onSelectEvent={handleSelectEvent}
                />

                <Modal show={showModal} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalMode === 'view' ? 'Event Details' : modalMode === 'edit' ? 'Edit Event' : 'Delete Event'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {modalMode !== 'delete' ? (
                            <Form>
                                <Form.Group controlId="formEventTitle">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedEvent ? selectedEvent.title : ''}
                                        onChange={(e) => setSelectedEvent({
                                            ...selectedEvent,
                                            title: e.target.value
                                        })}
                                        disabled={modalMode === 'view'}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEventStart">
                                    <Form.Label>Start</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={selectedEvent ? moment(selectedEvent.start).format('YYYY-MM-DDTHH:mm') : ''}
                                        onChange={(e) => setSelectedEvent({
                                            ...selectedEvent,
                                            start: new Date(e.target.value)
                                        })}
                                        disabled={modalMode === 'view'}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEventEnd">
                                    <Form.Label>End</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={selectedEvent ? moment(selectedEvent.end).format('YYYY-MM-DDTHH:mm') : ''}
                                        onChange={(e) => setSelectedEvent({
                                            ...selectedEvent,
                                            end: new Date(e.target.value)
                                        })}
                                        disabled={modalMode === 'view'}
                                    />
                                </Form.Group>
                            </Form>
                        ) : (
                            <p>Are you sure you want to delete this event?</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        {modalMode === 'view' && (
                            <>
                                <Button variant="secondary" onClick={() => { setModalMode('edit'); }}>Edit</Button>
                                <Button variant="danger" onClick={() => { setModalMode('delete'); }}>Delete</Button>
                            </>
                        )}
                        {modalMode === 'edit' && (
                            <Button variant="primary" onClick={handleEditEvent}>Save Changes</Button>
                        )}
                        {modalMode === 'delete' && (
                            <Button variant="danger" onClick={handleDeleteEvent}>Confirm Delete</Button>
                        )}
                        <Button variant="secondary" onClick={handleModalClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </GoogleOAuthProvider>
    );
};