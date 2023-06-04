import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useAuthValue } from "./AuthContext";
import "./mainPage.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setTimeActive } = useAuthValue();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        if (!auth.currentUser.emailVerified) {
          setTimeActive(true);
          navigate("/verify-email");
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div>
      <div className="auth">
        {error && <div className="auth__error">{error}</div>}
        <form onSubmit={handleLogin} name="login_form">
          <p className="page-title">Log in</p>
          <p className="form-title log-in-input">E-mail</p>
          <input
            className="input-field"
            type="email"
            value={email}
            required
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="form-title log-in-input">Password</p>
          <input
            className="input-field"
            type="password"
            value={password}
            required
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="main-button"
            style={{ marginTop: "12px", fontWeight: "bold" }}
          >
            Login
          </button>
        </form>
        <p style={{ margin: "25px", textAlign: "center" }}>
          Don't you have an account?&nbsp;
          <Link to="/register">Create an account!</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
