import React, { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import './message.css';
import "./mainPage.css";

function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const db = getDatabase();

    if (!name || !email || !message) {
      setError('Please fill in all the fields');
      return;
    }

    const newMessage = {
      name: name,
      email: email,
      message: message,
    };

    push(ref(db, 'messages'), newMessage)
      .then(() => {
        setName('');
        setEmail('');
        setMessage('');
        setError('');
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  };

  return (
    <div className="container">
      <h1 className='page-title'>Contact Us</h1>
      <p className='description'>
        We value your feedback and suggestions. Feel free to send us any advice or comments.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name" className="form-title">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="email" className="form-title">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="message" className="form-title">Message:</label>
          <textarea
            id="message"
            value={message}
            maxLength={500}
            rows="6"
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit"  className="main-button">Send Message</button>
      </form>
    </div>
  );
}

export default ContactPage;
