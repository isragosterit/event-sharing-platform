import { useState, useEffect } from 'react';
import { useAuthValue } from './AuthContext';
import { firestore } from './firebase';

function Dashboard() {
  const { user } = useAuthValue();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString());
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Update the current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Fetch the user's name from Firestore
    const docRef = firestore.collection('users').doc(user.uid);
    docRef.get().then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        setUserName(userData.name);
      } else {
        console.log('No such document!');
      }
    });
  }, [user.uid, firestore]);

  return (
    <div className='center'>
      <h1>Dashboard</h1>
      <div>Current Time: {currentTime}</div>
      <div>Current Date: {currentDate}</div>
      <div>User: {userName}</div>
    </div>
  );
}

export default Dashboard;
