import { useState, useContext, useRef, useEffect } from "react";
import { Avatar, Menu, MenuItem, Typography } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
// import {
//   doc,
//   updateDoc,
//   deleteDoc,
//   arrayRemove,
//   deleteField,
// } from "firebase/firestore";
// import { db } from "../firebase";

const Message = ({ message, handleReply, handleReplyScroll }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const ref = useRef(null);
  useEffect(() => {
    ref?.current?.scrollIntoView();
  }, [message]);
  const handleReplyClick = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleReplyOpen = () => {
    handleReply(
      message.id,
      message.senderId,
      message.sender,
      message.text,
      message.img
    );
    handleClose();
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const format = (date) => {
    const y = ("0" + date.getHours()).slice(-2);
    const m = ("0" + date.getMinutes()).slice(-2);
    return `${y}:${m}`;
  };

  return (
    <div
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <Avatar
        className="message__avatar"
        src={
          message.senderId === currentUser.uid
            ? currentUser.photoURL
            : data.user.photoURL
        }
      />
      <div
        className="message__content"
        onContextMenu={handleReplyClick}
        style={{
          alignItems:
            message.senderId === currentUser.uid ? "flex-end" : "flex-start",
        }}
      >
        <div
          className="message__block"
          style={{
            backgroundColor:
              message.img === null
                ? message.senderId === currentUser.uid
                  ? "#1875d1"
                  : "whitesmoke"
                : "transparent",
            borderRadius:
              message.senderId === currentUser.uid
                ? "10px 0px 10px 10px"
                : "0px 10px 10px 10px",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          {message.replyId && (
            <div
              className="reply"
              style={{
                color: message.senderId === currentUser.uid ? "white" : "black",
              }}
              onClick={() => handleReplyScroll(message.replyId)}
            >
              <Typography variant="caption" gutterBottom>
                {message.replySender}
              </Typography>
              {message.replyText && (
                <Typography variant="caption" gutterBottom>
                  {message.replyText}
                </Typography>
              )}
              {message.replyImage && (
                <img
                  src={message.replyImage}
                  width="10"
                  alt="replyImg"
                  loading="lazy"
                />
              )}
            </div>
          )}
          {message.text && (
            <Typography
              sx={{
                color: message.senderId === currentUser.uid ? "white" : "black",
              }}
            >
              {message.text}
            </Typography>
          )}
          {message.img && <img src={message.img} alt="" loading="lazy" />}
        </div>
        <div className="message__time">
          <Typography
            variant="caption"
            sx={{
              color: "gray",
            }}
          >
            {format(message.date.toDate())}
          </Typography>
          {/* 既読 */}
          {message.senderId === currentUser.uid && (
            <Typography>{message.receiverHasRead && "read"}</Typography>
          )}
        </div>
      </div>
      <div className="message__menu">
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <MenuItem onClick={handleReplyOpen}>Reply</MenuItem>
        </Menu>
      </div>
      <div ref={ref} />
    </div>
  );
};

export default Message;
