import React from "react";
import Calendar from "@ericz1803/react-google-calendar";
import { css } from "@emotion/react";

const API_KEY = "AIzaSyAmENulZCGuDqNtkl8lxROSMdp1O";

const calendars = [
  {
    calendarId: "YmFieXRyYWNrZXIuZnNAZ21haWwuY29t@group.calendar.google.com",
    color: "#B241D1",
  },
];

const styles = {
  calendar: {
    borderWidth: "3px",
  },
  today: css`
    color: red;
    border: 1px solid red;
  `,
};

const language = "ES";

export const GoogleCalendar2 = () => {
  return (
    <div>
      <Calendar
        apiKey={API_KEY}
        calendars={calendars}
        styles={styles}
        language={language}
      />
    </div>
  );
};
