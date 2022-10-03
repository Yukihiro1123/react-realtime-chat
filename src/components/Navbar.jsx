import { IconButton, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState, useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { Card, CardMedia, CardContent, Dialog } from "@mui/material";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleProfileOpen = () => {
    setProfileOpen(true);
  };

  const handleProfileClose = () => {
    setProfileOpen(false);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  function ProfileCard() {
    return (
      <Card sx={{ minWidth: 275 }}>
        <CardMedia
          component="img"
          height="200"
          image={currentUser.photoURL}
          alt="Paella dish"
        />
        <CardContent>
          <Typography paragraph gutterBottom>
            {currentUser.displayName}
          </Typography>
          <Typography paragraph gutterBottom>
            {currentUser.email}
          </Typography>
          <Typography
            variant="caption"
            gutterBottom
          >{`User ID: ${currentUser.uid}`}</Typography>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="navbar">
      <div className="navbar__userInfo" onClick={handleProfileOpen}>
        <img src={currentUser.photoURL} alt="" />
        <Typography sx={{ color: "black" }}>
          {currentUser.displayName}
        </Typography>
      </div>
      <Dialog onClose={handleProfileClose} open={profileOpen}>
        {ProfileCard()}
      </Dialog>
      <IconButton color="primary" onClick={handleLogout}>
        <LogoutIcon />
      </IconButton>
    </div>
  );
};

export default Navbar;
