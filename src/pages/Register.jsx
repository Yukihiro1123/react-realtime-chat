import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Backdrop, CircularProgress, Typography } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];
    try {
      //Create user
      setIsLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);
      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            //add a new document in collection "users"
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            setIsLoading(false);
            navigate("/");
          } catch (err) {
            console.log(err);
            setIsLoading(false);
            setErr(true);
          }
        });
      });
      setIsLoading(false);
    } catch (err) {
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
            register
          </Typography>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="display name" />
            <input type="email" placeholder="email" />
            <input type="password" placeholder="password" />
            <input
              type="file"
              id="file"
              accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp"
            />
            <button>Sign up</button>
            {err && <span>Something went wrong</span>}
          </form>
          <Typography variant="caption">
            You do have an account? <Link to="/login">Login</Link>
          </Typography>
        </div>
      )}
    </div>
  );
};

export default Register;
