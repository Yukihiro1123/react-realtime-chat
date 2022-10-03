import Message from "./Message";
import React, { useEffect, useState, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Input from "./Input";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });
    return () => {
      unSub();
    };
  }, [data.chatId]);
  console.log(messages);
  //リプライ
  //初期状態
  const replyInit = {
    id: null,
    senderId: null,
    sender: null,
    text: null,
    image: null,
  };
  const [reply, setReply] = useState(replyInit);
  const handleReply = (id, senderId, sender, text, image) => {
    setReply({
      id: id,
      senderId: senderId,
      sender: sender,
      text: text,
      image: image || null,
    });
  };
  const handleReplyClose = () => {
    setReply(replyInit);
  };
  //リプライ元までスクロール
  const refs = messages.reduce((acc, value) => {
    acc[value.id] = React.createRef();
    return acc;
  }, {});
  const handleReplyScroll = (id) => {
    refs[id].current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <>
      <div className="messages">
        {messages.map((m) => (
          <div ref={refs[m.id]} key={m.id}>
            <Message
              message={m}
              key={m.id}
              chatId={data.chatId}
              handleReply={handleReply}
              handleReplyScroll={handleReplyScroll}
            />
          </div>
        ))}
      </div>
      <Input reply={reply} handleReplyClose={handleReplyClose} />
    </>
  );
};

export default Messages;
