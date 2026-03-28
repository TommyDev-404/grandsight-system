import { createContext, useContext, useState } from "react";

const AuthModalContext = createContext();

export function AuthModalProvider({ children }) {
      const [view, setView] = useState("login");

      const switchView = (target) => setView(target);

      return (
            <AuthModalContext.Provider value={{ view, switchView }}>
                  {children}
            </AuthModalContext.Provider>
      );
}

export const useAuthModal = () => useContext(AuthModalContext);
