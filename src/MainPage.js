import React, { useState, useEffect } from "react";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  set,
} from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faUser,
  faCalendarAlt,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useAuthValue } from "./AuthContext";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import "./mainPage.css";

function HomePage() {
  const { currentUser } = useAuthValue();
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDescriptionError, setEventDescriptionError] = useState("");
  const [eventParticipants, setEventParticipants] = useState({});
  const [remainingCharacters, setRemainingCharacters] = useState(160);
  const [currentPage, setCurrentPage] = useState(1);
  const [eventImage, setEventImage] = useState(null);
  const [eventCategory, setEventCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!currentUser) {
      setEventDescriptionError("Please log in or sign up to share events.");
      return;
    }

    const currentDate = new Date();
    const eventTime = new Date(eventDate);

    if (eventTime < currentDate) {
      setEventDescriptionError("Please select a future date for the event.");
      return;
    }
    if (
      !eventName ||
      !eventLocation ||
      !eventDate ||
      !eventDescription ||
      !eventCategory ||
      !eventImage
    ) {
      setEventDescriptionError("Please fill in all fields");
      return;
    }

    const db = getDatabase();
    const displayName = currentUser.displayName || "Unknown";

    const storage = getStorage();
    const storageReference = storageRef(
      storage,
      `events/${new Date().getTime()}_${eventImage?.name}`
    );
    const uploadTask = uploadBytesResumable(storageReference, eventImage);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Upload progress
      },
      (error) => {
        console.error("Error uploading image:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const newEvent = {
            eventName: eventName,
            eventLocation: eventLocation,
            eventTime: eventTime.toISOString(),
            eventDescription: eventDescription,
            eventCategory: eventCategory,
            createdBy: currentUser.uid,
            createdByDisplayName: displayName,
            createdByEmail: currentUser.email,
            participants: {},
            eventImage: downloadURL,
          };

          push(ref(db, "events"), newEvent)
            .then(() => {
              setEventName("");
              setEventLocation("");
              setEventDate("");
              setEventDescription("");
              setEventDescriptionError("");
              setEventImage(null);
              setEventCategory("");
            })
            .catch((error) => {
              console.error("Error adding event:", error);
            });
        });
      }
    );
  };

  const handleDescriptionChange = (e) => {
    setEventDescription(e.target.value);
    setRemainingCharacters(160 - e.target.value.length);
  };

  const joinEvent = (eventId) => {
    if (!currentUser) {
      alert("Please log in or sign up to join events.");
      return;
    }
    const db = getDatabase();
    const eventRef = ref(
      db,
      `events/${eventId}/participants/${currentUser.uid}`
    );

    if (eventParticipants[eventId]?.[currentUser.uid]) {
      remove(eventRef).catch((error) => console.error(error));
    } else {
      const user = {
        displayName: currentUser.displayName,
        email: currentUser.email,
        uid: currentUser.uid,
      };
      set(eventRef, user).catch((error) => console.error(error));
    }
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
      setEventParticipants(participantsData);
    });
  }, []);

  const eventsPerPage = 12;

  const filteredEvents = selectedCategory
    ? events.filter((event) => event.eventCategory === selectedCategory)
    : events;

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {currentUser && (
        <form className="form-container" onSubmit={handleSubmit}>
          <p className="form-title">Event Name</p>
          <input
            className="input-field"
            type="text"
            maxLength="110"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
          <p className="form-title">Event Location</p>
          <input
            className="input-field"
            type="text"
            maxLength="45"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
          />
          <p className="form-title">Event Date</p>
          <div className="datetime-field">
            <input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>
          <p className="form-title">Event Description</p>
          <textarea
            className="input-field description-input"
            rows="3"
            name="eventDescription"
            maxLength="160"
            value={eventDescription}
            onChange={handleDescriptionChange}
          />
          {eventDescriptionError && (
            <p className="description-error">{eventDescriptionError}</p>
          )}
          <p className="character-info">
            {remainingCharacters} / 160 characters
          </p>
          <p className="form-title">Event Category</p>
          <select
            className="input-field category-options"
            value={eventCategory}
            onChange={(e) => setEventCategory(e.target.value)}
          >
            <option value="">Choose a category</option>
            <option value="festival">Festivals</option>
            <option value="concert">Concerts</option>
            <option value="tech-events">Tech Events</option>
            <option value="conference">Conferences</option>
            <option value="workshop">Workshops</option>
            <option value="seminar">Seminars</option>
            <option value="exhibition">Exhibitions</option>
            <option value="sports">Sports</option>
            <option value="others">Others</option>
          </select>
          <div className="button-field">
            <p className="form-title">Choose a Image</p>
            <input
              type="file"
              className="image-input"
              onChange={(e) => {
                setEventImage(e.target.files[0]);
                const label = e.target.nextElementSibling;
              }}
            />

            <button type="submit" className="main-button">
              Share
            </button>
          </div>
        </form>
      )}
      {!currentUser && (
        <p className="info-message">
          Please log in or sign up to share events.
        </p>
      )}
      <br />
      <div className="categories">
        <button
          onClick={() => {
            setSelectedCategory("");
            setCurrentPage(1);
          }}
          className="event-category"
        >
          All Events
        </button>
        <button
          onClick={() => {
            setSelectedCategory("festival");
            setCurrentPage(1);
          }}
          className="event-category"
        >
          Festivals
        </button>
        <button
          onClick={() => {
            setSelectedCategory("concert");
            setCurrentPage(1);
          }}
          className="event-category"
        >
          Concerts
        </button>
        <button
          onClick={() => {
            setSelectedCategory("tech-events");
            setCurrentPage(1);
          }}
          className="event-category"
        >
          Tech Events
        </button>
        <button
          onClick={() => {
            setSelectedCategory("conference");
            setCurrentPage(1);
          }}
          className="event-category"
        >
          Conferences
        </button>
        <button
          onClick={() => {
            setSelectedCategory("workshop");
            setCurrentPage(1);
          }}
          className="event-category"
        >
          Workshops
        </button>
        <button
          onClick={() => {
            setSelectedCategory("seminar");
            setCurrentPage(1);
          }}
          className="event-category"
        >
          Seminars
        </button>
        <button
          onClick={() => {
            setSelectedCategory("exhibition");
            setCurrentPage(1);
          }}
          className="event-category"
        >
          Exhibitions
        </button>
        <button
          onClick={() => {
            setSelectedCategory("sports");
            setCurrentPage(1);
          }}
          className="event-category"
        >
          Sports
        </button>
        <button
          onClick={() => {
            setSelectedCategory("others");
            setCurrentPage(1);
          }}
          className="event-category"
        >
          Others
        </button>

        {/* Add more buttons for each category */}
      </div>
      <br />
      <div className="eventsContainer">
        {currentEvents.map((event) => (
          <div key={event.id} className="event-item">
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
            {Object.keys(eventParticipants[event.id] || {}).length > 0 && (
              <span className="participant-count">
                {Object.values(eventParticipants[event.id] || {}).length}{" "}
                participants
              </span>
            )}
            {event.eventImage && (
              <div className="event-image">
                <img src={event.eventImage} alt="Event" />
              </div>
            )}
            <br></br>
            <div className="event-action">
              {currentUser && currentUser.uid !== event.createdBy && (
                <>
                  <button onClick={() => joinEvent(event.id)}>
                    {eventParticipants[event.id]?.[currentUser.uid]
                      ? "Undo"
                      : "Join"}
                  </button>
                </>
              )}
            </div>
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

export default HomePage;
