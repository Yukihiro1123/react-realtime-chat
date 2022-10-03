import { Typography, IconButton } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useContext } from "react";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  arrayUnion,
  doc,
  Timestamp,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

const Input = ({ reply, handleReplyClose }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());
      console.log(img);
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                sender: currentUser.displayName,
                date: Timestamp.now(),
                img: downloadURL,
                //既読
                receiverHasRead: false,
                //リプライ
                replyId: reply?.id,
                replySenderId: reply?.senderId,
                replySender: reply?.sender,
                replyText: reply?.text,
                replyImage: reply?.image,
              }),
            });
          });
        }
      );
      handleReplyClose();
    } else {
      console.log(reply);
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          sender: currentUser.displayName,
          date: Timestamp.now(),
          img: null,
          //既読
          receiverHasRead: false,
          //リプライ
          replyId: reply?.id,
          replySenderId: reply?.senderId,
          replySender: reply?.sender,
          replyText: reply?.text,
          replyImage: reply?.image,
        }),
      });
    }
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
    handleReplyClose();
    setText("");
    setImg(null);
  };
  return (
    <div className="input">
      {/* メッセージフォーム */}
      {reply?.id && (
        <div className="reply__message">
          <div style={{ marginLeft: "10px" }}>
            <Typography variant="caption" sx={{ color: "white" }}>
              {reply.sender}
            </Typography>
            <Typography variant="body2" sx={{ color: "white" }}>
              {reply.text}
            </Typography>
          </div>
          <CloseIcon onClick={handleReplyClose} />
        </div>
      )}
      <div className="input__form">
        <input
          type="text"
          placeholder="Enter Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="send">
          {/* 画像選択 */}
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
          >
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={(e) => setImg(e.target.files[0])}
            />
            <ImageIcon />
          </IconButton>
          {/*  送信ボタン */}
          <IconButton
            color="primary"
            aria-label="send message"
            onClick={handleSend}
          >
            <SendIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default Input;
