import { createContext, useContext, useState } from "react";

const ModalContext = createContext(); // 1️⃣ Create the context

export const useModal = () => useContext(ModalContext); // 2️⃣ Custom hook to use it

export const ModalProvider = ({ children }) => {
      const defaultModal = { // the 
            name: null,
            payload: null,
            title: null,
            icon: null,
            type: null, // for the admin page modal reusability
            areaSelected: null
      };

      const [modal, setModal] = useState(defaultModal);
      
      const openModal = (data) => setModal({...defaultModal, ...data});   // Open modal with all its data
      const closeModal = () => setModal(defaultModal);

      return (
            <ModalContext.Provider value={{ modal, openModal, closeModal }}>
                  {children} 
            </ModalContext.Provider>
      );
};
