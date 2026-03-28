import { createContext, useContext, useState } from "react";

const PageHeaderContext = createContext();

export function PageHeaderProvider({ children }) {
      const [header, setHeader] = useState(localStorage.getItem('currentPage'));

      const handleSetHeader = (name) => setHeader(name);
      
      return (
            <PageHeaderContext.Provider value={{ header, handleSetHeader }}>
                  {children}
            </PageHeaderContext.Provider>
      );
}

export const usePageHeader = () => useContext(PageHeaderContext);
