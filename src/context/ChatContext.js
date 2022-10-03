import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();
export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE = { chatId: "null", user: {} };
  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        console.log(action.payload);
        // console.log(currentUser.uid); //NI71kJ07p8TR0Njp949acZw31sw2
        // console.log(action.payload.uid); //SFn5p1IxIgaLkw2bJN5ixIKfJ482
        // console.log(currentUser.uid > action.payload.uid); //false
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid //何と何を比較しているのかよくわからない
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
