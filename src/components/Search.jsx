//うまくいかなかったらhandleSelectから
import { Button, Typography } from "@mui/material";
import { useState, useContext } from "react";
import {
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
const Search = () => {
  const { currentUser } = useContext(AuthContext);
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("uid", "==", userId));
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };
  const handleKeyPress = (e) => {
    e.code === "Enter" && handleSearch();
  };
  const handleSelect = async () => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      //check whether the group(chats in firestore) exists, if not create
      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        //追加する側のチャットデータを追加
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        //追加される側のチャットデータを追加
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      setErr(true);
    }
    setUser(null);
    setUserId("");
  };
  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search UserID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      {/*
      <TextField
        label="Search user"
        variant="outlined"
        size="small"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        onKeyDown={handleKeyPress}
        fullWidth
      />
      */}
      {err && <span>User not found</span>}
      {user && (
        <div className="searchResult">
          <Typography variant="caption">Search Result</Typography>
          <Button
            className="searchChat"
            variant="text"
            sx={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "flex-start",
              width: "100%",
            }}
            onClick={handleSelect}
          >
            <img src={user.photoURL} alt="" />
            <span>{user.displayName}</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Search;
