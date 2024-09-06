import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import ApiCalendar from 'react-google-calendar-api';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Button, Form } from 'react-bootstrap';
import "../../styles/googlecalendar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebookF, faXTwitter, faGoogle } from '@fortawesome/free-brands-svg-icons';

const CLIENT_ID = "1059256211415-jqr22lfih5jre0cl0nbmhi7bd0q55cf0.apps.googleusercontent.com";
const config = {
    clientId: CLIENT_ID,
    apiKey: "AIzaSyAmENulZCGuDqNtkl8lxROSMdp1O5gJeKM",
    scope: "https://www.googleapis.com/auth/calendar",
    discoveryDocs: [
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
    const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'delete', 'add'

    useEffect(() => {
        if (isSignedIn) {
            fetchEvents();
        }
    }, [isSignedIn]);

    const fetchEvents = async () => {
        try {
            const timeMin = new Date().toISOString(); 
            const timeMax = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(); 

            let response = await apiCalendar.listEvents({
                timeMin,  
                timeMax,  
                showDeleted: false,
                maxResults: 50, 
                orderBy: 'startTime',  
                singleEvents: true  
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
                fetchEvents(); 
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

    const handleAddEvent = () => {
        if (!isSignedIn) return alert('Please sign in first');

        setSelectedEvent({
            title: '',
            start: new Date(),
            end: new Date(new Date().getTime() + 60 * 60 * 1000),
        });
        setModalMode('add');
        setShowModal(true);
    };

    const handleSaveEvent = async () => {
        if (!isSignedIn || !selectedEvent) return;

        const event = {
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
            if (modalMode === 'add') {
                await apiCalendar.createEvent(event);
            } else if (modalMode === 'edit') {
                await apiCalendar.updateEvent(selectedEvent.id, event);
            }

            await fetchEvents(); 
            setShowModal(false);
        } catch (error) {
            console.error("Error saving event: ", error);
        }
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setModalMode('view');
        setShowModal(true);
    };

    const handleEditEvent = () => {
        setModalMode('edit');
    };

    const handleDeleteEvent = async () => {
        if (!isSignedIn || !selectedEvent) return;

        try {
            await apiCalendar.deleteEvent(selectedEvent.id);
            await fetchEvents(); 
            setShowModal(false);
        } catch (error) {
            console.error("Error deleting event: ", error);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const formats = {
        dayFormat: (date, culture, localizer) =>
            localizer.format(date, 'ddd', culture).charAt(0),
    };

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <div>
            <div className="calendar-btn-container">
                <button onClick={handleSignIn}><FontAwesomeIcon icon={faGoogle} /></button>
                <button onClick={handleAddEvent}>Add Event</button>
            </div>
                <div className="custom-calendar-container">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500, margin: "50px" }}
                        onSelectEvent={handleSelectEvent}
                        formats={formats}
                    />
                </div>

                <Modal show={showModal} onHide={handleModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {modalMode === 'view' ? 'Event Details' : modalMode === 'edit' ? 'Edit Event' : 'Add Event'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {modalMode !== 'delete' ? (
                            <Form>
                                <Form.Group controlId="formEventTitle">
                                    <Form.Label className="form-label">Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        className="form-control"
                                        value={selectedEvent ? selectedEvent.title : ''}
                                        onChange={(e) => setSelectedEvent({
                                            ...selectedEvent,
                                            title: e.target.value
                                        })}
                                        disabled={modalMode === 'view'}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEventStart">
                                    <Form.Label className="form-label">Start</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        className="form-control"
                                        value={selectedEvent ? moment(selectedEvent.start).format('YYYY-MM-DDTHH:mm') : ''}
                                        onChange={(e) => setSelectedEvent({
                                            ...selectedEvent,
                                            start: new Date(e.target.value)
                                        })}
                                        disabled={modalMode === 'view'}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEventEnd">
                                    <Form.Label className="form-label">End</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        className="form-control"
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
                                <Button variant="secondary" onClick={handleEditEvent} className="btn-login-modal">Edit</Button>
                                <Button variant="danger" onClick={() => setModalMode('delete')} className="btn-login-modal">Delete</Button>
                            </>
                        )}
                        {modalMode === 'edit' || modalMode === 'add' ? (
                            <Button variant="primary" onClick={handleSaveEvent} className="btn-login-modal">
                                {modalMode === 'add' ? 'Add Event' : 'Save Changes'}
                            </Button>
                        ) : null}
                        {modalMode === 'delete' && (
                            <Button variant="danger" onClick={handleDeleteEvent} className="btn-login-modal">Confirm Delete</Button>
                        )}
                        <Button variant="secondary" onClick={handleModalClose} className="btn-login-modal">Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
            
        </GoogleOAuthProvider>
    );
};
