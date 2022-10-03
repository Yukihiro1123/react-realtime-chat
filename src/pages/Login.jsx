import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Backdrop, CircularProgress, Typography } from "@mui/material";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const email = e.target[0].value;
    const password = e.target[1].value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      navigate("/");
      window.location.reload(false);
    } catch (err) {
      setIsLoading(false);
      setErr(true);
    }
  };
  return (
    <div className="formContainer">
      {isLoading ? (
        <Backdrop open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <div className="formWrapper">
          <Typography variant="h5" sx={{ marginTop: "20px" }}>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="email" />
            <input type="password" placeholder="password" />
            <button>Sign in</button>
            {err && <span>Something went wrong</span>}
          </form>
          <Typography variant="caption">
            You don't have an account? <Link to="/register">Register</Link>
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Login;
