import { useState, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
//import Input from "./Input";
import Messages from "./Messages";
import IconButton from "@mui/material/IconButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VideocamIcon from "@mui/icons-material/Videocam";
import { Menu, MenuItem, Typography } from "@mui/material";
import chatLogo from "../img/chatlogo.jpg";

const Chat = () => {
  const { data } = useContext(ChatContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="chat">
      {data.chatId !== "null" ? (
        <>
          <div className="chatInfo">
            {/* 画面上部のアイコンetc */}
            <Typography
              variant="body1"
              sx={{ color: "black", paddingLeft: "20px" }}
            >
              {data.user?.displayName}
            </Typography>
            <div className="chatIcons">
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <VideocamIcon />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <PersonAddIcon />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                onClick={handleClick}
              >
                <MoreHorizIcon />
              </IconButton>
              {/* 詳細ボタンをクリックすると開くメニュー */}
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
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
                <MenuItem onClick={handleClose}>Background</MenuItem>
                <MenuItem onClick={handleClose}>Mute</MenuItem>
              </Menu>
            </div>
          </div>
          <Messages />
        </>
      ) : (
        <div className="unseen">
          <img src={chatLogo} width="200" alt="chatIcon" />
        </div>
      )}
    </div>
  );
};

export default Chat;
