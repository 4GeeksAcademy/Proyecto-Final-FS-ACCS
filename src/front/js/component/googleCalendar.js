import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
const CLIENT_ID = "1059256211415-jqr22lfih5jre0cl0nbmhi7bd0q55cf0.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/calendar.events.readonly";
import ApiCalendar from 'react-google-calendar-api';
  const config = {
    "clientId": "1059256211415-jqr22lfih5jre0cl0nbmhi7bd0q55cf0.apps.googleusercontent.com",
    "apiKey": "AIzaSyAmENulZCGuDqNtkl8lxROSMdp1O5gJeKM",
    "scope": "https://www.googleapis.com/auth/calendar",
    "discoveryDocs": [
      "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
    ]
  }
  const apiCalendar = new ApiCalendar(config)
  async function handleItemClick(event , name) {
        if (name === 'sign-in') {
          let response = await apiCalendar.handleAuthClick()
            console.log(response);
                if(response.access_token){
                        console.log(apiCalendar)
                      apiCalendar.listEvents({
                        timeMin: new Date().toISOString(),
                        timeMax: new Date("09/10/2024").toISOString(),
                        showDeleted: true,
                        maxResults: 10,
                        orderBy: 'updated'
                    }).then(({ result }) => {
                      console.log(result.items);
                    });

                }
        } else if (name === 'sign-out') {
          apiCalendar.handleSignoutClick();
        }
  }
const GoogleCalendar = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [events, setEvents] = useState([]);
    const [accessToken, setAccessToken] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const handleSuccess = (credentialResponse) => {
        console.log("Login exitoso:", credentialResponse);
        const token = credentialResponse.access_token;
        setAccessToken(token);
        setIsSignedIn(true);
        listUpcomingEvents(token); // Llamar a la función para listar eventos
    };
    const handleError = (error) => {
        console.log("Error en la autenticación:", error);
        setErrorMessage('Failed to log in. Please try again.');
    };
    const listUpcomingEvents = (token) => {
        fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=' + new Date().toISOString() + '&showDeleted=false&singleEvents=true&maxResults=10&orderBy=startTime', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch events from Google Calendar.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched events:', data.items);
                if (data.items && data.items.length > 0) {
                    setEvents(data.items);
                } else {
                    setErrorMessage('No upcoming events found.');
                }
            })
            .catch(error => {
                console.error('Error fetching events:', error);
                setErrorMessage('Error fetching events. Please try again.');
            });
    };
    const handleLogout = () => {
        googleLogout();
        setIsSignedIn(false);
        setEvents([]);
        setAccessToken(null);
    };
    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
<button
                                onClick={(e) => handleItemClick(e, 'sign-in')}
                            >
                                sign-in
                            </button>
                            <button
                                onClick={(e) => handleItemClick(e, 'sign-out')}
                            >
                                sign-out
                            </button>
                            
        </GoogleOAuthProvider>
    );
};
export default GoogleCalendar;