import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export function GlobalStorageContextProvider({ children }) {
      const [ selectedButton, setSelectedButton ] = useState(null);
      const [ bookingSelected, setBookingSelected ] = useState(null); 
      const [ buttons, setButtons ] = useState([]);

      const clearSelection = () => setBookingSelected(null);


      return (
            <GlobalContext.Provider value={{ 
                  bookingSelected,
                  setBookingSelected,
                  clearSelection,
                  selectedButton,
                  setSelectedButton,
                  buttons, 
                  setButtons
            }}>
                  {children}
            </GlobalContext.Provider>
      );
}

export const useGlobalContext = () => useContext(GlobalContext);
