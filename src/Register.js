import { useState } from "react";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useAuthValue } from "./AuthContext";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import "./mainPage.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setTimeActive } = useAuthValue();
  const db = getFirestore();

  const validatePassword = () => {
    let isValid = true;
    if (password !== "" && confirmPassword !== "") {
      if (password !== confirmPassword) {
        isValid = false;
        setError("Passwords do not match");
      }
    }
    return isValid;
  };

  const createUserInFirestore = async (name, email) => {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        name: name,
        email: email,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const register = (e) => {
    e.preventDefault();
    setError("");
    if (validatePassword()) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          updateProfile(userCredential.user, {
            displayName: name,
          })
            .then(() => {
              createUserInFirestore(name, email);
              sendEmailVerification(userCredential.user)
                .then(() => {
                  setTimeActive(true);
                  navigate("/verify-email");
                })
                .catch((err) => alert(err.message));
            })
            .catch((err) => setError(err.message));
        })
        .catch((err) => setError(err.message));
    }
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="center">
      <div className="auth">
        {error && <div className="auth__error">{error}</div>}
        <form onSubmit={register} name="registration_form">
          <p className="page-title">Register</p>
          <p className="form-title">Name</p>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
          <p className="form-title">E-mail</p>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="form-title">Password</p>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="form-title">Confirm password</p>
          <input
            type="password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="submit"
            className="main-button"
            style={{ marginTop: "12px", fontWeight: "bold" }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
