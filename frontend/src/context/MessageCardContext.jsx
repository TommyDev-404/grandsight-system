import { createContext, useContext, useState } from "react";
import MessageCard from "../shared/MessageCard";

const MessageCardContext = createContext(); // 1️⃣ Create the context

export const useMessageCard = () => useContext(MessageCardContext); // 2️⃣ Custom hook to use it

export const MessageCardProvider = ({ children }) => {
      const [messageInfo, setMessageInfo] = useState(null);

      const showMessage = ({ status, message, duration = 3000 }) => {
            setMessageInfo({ status, message, duration });
      };

      return (
            <MessageCardContext.Provider value={{ showMessage }}>
                  {children}
            
                  {messageInfo && (
                        <MessageCard
                              status={messageInfo.status}
                              message={messageInfo.message}
                              duration={messageInfo.duration}
                              onClose={() => setMessageInfo(null)}
                        />
                  )}
            </MessageCardContext.Provider>
      );
};

