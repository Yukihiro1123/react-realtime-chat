import { Avatar, Button, Typography } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });
      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);
  // console.log(Object.entries(chats));
  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };
  return (
    <div className="chats">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div className="userChat" key={chat[0]}>
            <Button
              variant="text"
              sx={{
                display: "flex",
                paddingTop: "15px",
                paddingBottom: "15px",
                marginLeft: "10px",
                justifyContent: "flex-start",
                width: "100%",
                textTransform: "none",
              }}
              onClick={() => handleSelect(chat[1].userInfo)}
            >
              <img src={chat[1].userInfo.photoURL} alt="" />
              <div className="userChatInfo">
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ color: "black", m: 1, paddingLeft: "10px" }}
                >
                  {chat[1].userInfo.displayName}
                </Typography>
                <Typography
                  variant="body2"
                  component="h2"
                  sx={{ color: "gray" }}
                >
                  {chat[1].lastMessage?.text.length >= 10
                    ? chat[1].lastMessage?.text.slice(0, 8) + "..."
                    : chat[1].lastMessage?.text}
                </Typography>
              </div>
            </Button>
          </div>
        ))}
    </div>
  );
};

export default Chats;
