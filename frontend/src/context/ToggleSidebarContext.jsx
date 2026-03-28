import { createContext, useContext, useState } from "react";

const ToggleContext = createContext();

export function ToggleSidebarProvider({ children }) {
      const [sidebarOpen, setSidebarOpen] = useState(false);

      const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

      return (
            <ToggleContext.Provider value={{ sidebarOpen, toggleSidebar }}>
                  {children}
            </ToggleContext.Provider>
      );
}

export const useToggleSidebar = () => useContext(ToggleContext);
