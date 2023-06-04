import React, { useState, useEffect } from "react";
import { getDatabase, get, ref, onValue, set } from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faUser,
  faCalendarAlt,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthValue } from "./AuthContext";
import "./message.css";
import "./mainPage.css";

function BrowseEvents() {
  const { currentUser } = useAuthValue();
  const [searchCity, setSearchCity] = useState("");
  const [searchEventName, setSearchEventName] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [participantsData, setParticipantsData] = useState({});
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleCityChange = (e) => {
    setSearchCity(e.target.value);
  };

  const handleEventNameChange = (e) => {
    setSearchEventName(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const filtered = events.filter((event) => {
      if (
        searchCity &&
        !event.eventLocation.toLowerCase().includes(searchCity.toLowerCase())
      ) {
        return false;
      }

      if (
        searchEventName &&
        !event.eventName.toLowerCase().includes(searchEventName.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    setFilteredEvents(filtered);
    setSearchPerformed(true);
  };

  const joinEvent = (eventId) => {
    if (!currentUser) {
      alert("Please log in or sign up to join events.");
      return;
    }

    const db = getDatabase();
    const eventRef = ref(db, `events/${eventId}`);

    get(eventRef)
      .then((snapshot) => {
        const event = snapshot.val();

        if (!event) {
          console.error(`Event with ID: ${eventId} not found.`);
          return;
        }

        const participantRef = ref(
          db,
          `events/${eventId}/participants/${currentUser.uid}`
        );

        if (event.participants && event.participants[currentUser.uid]) {
          const updatedParticipants = { ...event.participants };
          delete updatedParticipants[currentUser.uid];

          set(participantRef, updatedParticipants)
            .then(() => {
              setParticipantsData((prevParticipantsData) => ({
                ...prevParticipantsData,
                [eventId]: updatedParticipants,
              }));
            })
            .catch((error) => console.error(error));
        } else {
          const user = {
            displayName: currentUser.displayName,
            email: currentUser.email,
            uid: currentUser.uid,
          };

          set(participantRef, {
            ...event.participants,
            [currentUser.uid]: user,
          })
            .then(() => {
              setParticipantsData((prevParticipantsData) => ({
                ...prevParticipantsData,
                [eventId]: { ...event.participants, [currentUser.uid]: user },
              }));
            })
            .catch((error) => console.error(error));
        }
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    const db = getDatabase();
    const eventsRef = ref(db, "events");

    onValue(eventsRef, (snapshot) => {
      const eventsData = [];
      const participantsData = {};

      snapshot.forEach((childSnapshot) => {
        const event = childSnapshot.val();
        event.id = childSnapshot.key;

        eventsData.push(event);

        participantsData[event.id] = event.participants || {};
      });

      setEvents(eventsData);
      setParticipantsData(participantsData);
    });
  }, []);

  const eventsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <div style={{ margin: "25px" }}>
        <h1 className="page-title">Browse Events</h1>
        <p className="description">
          Explore, search and join events - On our 'Browse Events' page, you can
          discover various events, delve into their details, and select the ones
          you wish to participate in.
        </p>
      </div>
      <form onSubmit={handleSearch} style={{ marginBottom: "50px" }}>
        <label htmlFor="name" className="form-title">
          Location
        </label>
        <input type="text" value={searchCity} onChange={handleCityChange} />

        <label htmlFor="name" className="form-title">
          Event Name
        </label>
        <input
          type="text"
          value={searchEventName}
          onChange={handleEventNameChange}
        />
        <button type="submit" className="main-button">
          Search
        </button>
      </form>

      {searchPerformed && filteredEvents.length === 0 && (
        <p>No events found.</p>
      )}

      <div className="eventsContainer">
        {currentEvents.map((event) => (
          <div key={event.id} className="event-item">
            {/* Event details... */}
            <div className="event-info">
              <span className="event-text event-name">{event.eventName}</span>
            </div>
            <div className="event-info">
              <span className="event-icon">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </span>
              <span className="event-text event-location">
                {event.eventLocation}
              </span>
            </div>
            <div className="event-info">
              <span className="event-icon">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </span>
              <span className="event-text eventTime-info">
                {new Date(event.eventTime).toLocaleString()}
              </span>
            </div>
            <div className="event-info">
              <span className="event-icon">
                <FontAwesomeIcon icon={faInfoCircle} />
              </span>
              <span className="event-text event-description">
                {event.eventDescription}
              </span>
            </div>
            {/* Participant Count */}
            <div className="event-info">
              <span className="event-icon">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <span className="event-text">
                {Object.keys(participantsData[event.id] || {}).length}{" "}
                Participants
              </span>
            </div>

            {event.eventImage && (
              <div className="event-image">
                <img src={event.eventImage} alt="Event" />
              </div>
            )}
            {/* Join button... */}
            {currentUser && currentUser.uid !== event.createdBy && (
              <div className="event-action">
                <button onClick={() => joinEvent(event.id)}>
                  {participantsData[event.id]?.[currentUser.uid]
                    ? "Undo"
                    : "Join"}
                </button>
              </div>
            )}
            <div className="event-info">
              <span className="event-text user-name">
                <FontAwesomeIcon icon={faUser} />
                &nbsp;&nbsp;{event.createdByDisplayName}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        {filteredEvents.length > eventsPerPage && (
          <ul className="pagination-elements">
            {Array.from(
              { length: Math.ceil(filteredEvents.length / eventsPerPage) },
              (_, index) => (
                <li
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BrowseEvents;
