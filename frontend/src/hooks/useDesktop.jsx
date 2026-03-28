import { useState, useEffect } from "react";

export default function useDesktop() {
      const [isDesktop, setIsDesktop] = useState(window.matchMedia("(min-width: 768px)").matches);
      
      useEffect(() => {
            const mediaQuery = window.matchMedia("(min-width: 768px)"); // get the current viewport status

            const handleResize = (event) => {  
                  setIsDesktop(event.matches);
            };

            mediaQuery.addEventListener('change', handleResize); // listen for viewport changes

            return () => { mediaQuery.removeEventListener('change', handleResize); };
      }, []);     

      return isDesktop;
}