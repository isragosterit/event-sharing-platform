import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { useAuthValue } from "./AuthContext";
import "./myevents.css";

function MyEventsPage() {
  const [myEvents, setMyEvents] = useState([]);
  const { currentUser } = useAuthValue();

  useEffect(() => {
    const db = getDatabase();
    const eventsRef = ref(db, "events");

    onValue(eventsRef, (snapshot) => {
      const eventsData = [];

      snapshot.forEach((childSnapshot) => {
        const event = childSnapshot.val();
        event.id = childSnapshot.key;

        if (event.createdBy === currentUser?.uid) {
          eventsData.push(event);
        }
      });

      setMyEvents(eventsData);
    });
  }, [currentUser]);

  const handleDelete = (eventId) => {
    const db = getDatabase();
    const eventRef = ref(db, `events/${eventId}`);
    remove(eventRef);
  };

  return (
    <div>
      <h1
        className="page-title"
        style={{ margin: "15px", textAlign: "center" }}
      >
        My Events
      </h1>
      <div className="eventsContainer">
        {myEvents.map((event) => (
          <div key={event.id} className="event-item">
            <div className="event-info">
              <span className="event-text">{event.eventName}</span>
            </div>
            <div className="event-info">
              <span className="event-text">{event.eventLocation}</span>
            </div>
            <div className="event-info">
              <span className="event-text">
                {new Date(event.eventTime).toLocaleString()}
              </span>
            </div>
            <div className="event-info">
              <span className="event-text">{event.eventDescription}</span>
            </div>
            <span className="event-text">Participants:</span>
            <div className="participants-container">
              <ul className="participants-list">
                {Object.values(event.participants || {}).map((participant) => (
                  <li key={participant.uid} className="participants-list">
                    <span>Name: {participant.displayName}</span>
                    <span>Email: {participant.email}</span>
                  </li>
                ))}
              </ul>
              <div className="event-action">
                <button
                  onClick={() => handleDelete(event.id)}
                  className="main-button"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyEventsPage;
