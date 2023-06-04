import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import './about.css';

const About = () => {
  return (
    <div className="container">
      <div className="header">
        <Link to="/" className="home-link">
          <FontAwesomeIcon icon={faHome} />
          <span>Go Home</span>
        </Link>
      </div>
      <div className="content">
      <p className='page-title'>About Our Application</p>
        <h5>What is this application?</h5>
        <p>This application is a platform for sharing and joining events based on location, time, and type. After becoming a member and logging in, users can share their own events by adding images and participate in the activities of others.</p>
        
        <h5>How does it work?</h5>
        <p>Users can create events by filling in details about the event's name, location, time, a brief description, and uploading an image related to the event. Once an event is created, it appears in a list where all members can view the details, including the event image, and join if they are interested. The application also keeps track of the number of participants for each event. If a user decides to withdraw from an event, they can simply choose to 'undo' their participation.</p>
        
        <h5>Why use this application?</h5>
        <p>This application fosters a sense of community by enabling users to share activities and join others, with the added feature of including images for a more visual experience. Whether you're new to a city or just looking to expand your social circle, this application can be a great tool for connection and engagement.</p>
      </div>
    </div>
  );
};

export default About;
