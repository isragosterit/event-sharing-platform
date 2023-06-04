import React, { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import { useAuthValue } from './AuthContext';
import './message.css';

function ReportIssue() {
  const { currentUser } = useAuthValue();
  const [issue, setIssue] = useState('');
  const [issueError, setIssueError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
  
    if (!currentUser) {
      setIssueError('Please log in to report an issue');
      return;
    }

    const db = getDatabase();
  
    if (!issue) {
      setIssueError('Please fill in the issue');
      return;
    }
  
    const newIssue = {
      issue: issue,
      userEmail: currentUser.email,
    };
  
    push(ref(db, 'issues'), newIssue)
      .then(() => {
        setIssue('');
        setIssueError('');
      })
      .catch((error) => {
        console.error('Error reporting issue:', error);
      });
  };

  return (
    <div className="container">
      <h1 className='page-title'>Report an Issue</h1>
      <p className='description'>
        If you have encountered any problems or have feedback regarding our application, please let us know by describing the issue you're experiencing. Your input helps us improve our services and provide a better experience for all users.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column'}}>
      <label htmlFor="message" className="form-title">Message:</label>
        <textarea
          value={issue}
          maxLength={500}
          rows="6"
          onChange={(e) => setIssue(e.target.value)}
        />
        {issueError && <p style={{ color: 'red', fontSize: '13px', marginBottom: '10px' }}>{issueError}</p>}
        <button type="submit" style={{ marginTop: '10px' }} className="main-button">Report Issue</button>
      </form>
    </div>
  );
}

export default ReportIssue;
