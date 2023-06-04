import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import MainPage from "./MainPage";
import Register from "./Register";
import VerifyEmail from "./VerifyEmail";
import Login from "./Login";
import { useState, useEffect } from "react";
import { AuthProvider } from "./AuthContext";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import PrivateRoute from "./PrivateRoute";
import { Navigate } from "react-router-dom";
import MyNavbar from "./Navbar";
import MyEvents from "./MyEvents";
import About from "./About";
import Contact from "./Contact";
import ReportIssue from "./ReportIssue";
import BrowseEvents from "./BrowseEvents";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [timeActive, setTimeActive] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <Router>
      <AuthProvider value={{ currentUser, timeActive, setTimeActive }}>
        <MyNavbar />
        {currentUser === undefined ? (
          <div>Loading...</div>
        ) : (
          <Routes>
            <Route
              exact
              path="/"
              element={
                currentUser && currentUser.emailVerified ? (
                  <PrivateRoute>
                    <MainPage />
                  </PrivateRoute>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/login"
              element={
                !currentUser || !currentUser.emailVerified ? (
                  <Login />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/MyEvents" element={<MyEvents />} />
            <Route path="/about" element={<About />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/ReportIssue" element={<ReportIssue />} />
            <Route path="/home" element={<Home />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/MainPage" element={<MainPage />} />
            <Route path="/BrowseEvents" element={<BrowseEvents />} />
          </Routes>
        )}
      </AuthProvider>
    </Router>
  );
}

export default App;
