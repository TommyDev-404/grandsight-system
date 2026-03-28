import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(); // create context

export const useTheme = () => useContext(ThemeContext); // custom hooks

// create provider
export default function ThemeProvider({ children }){
      const themeOptions = {
            bluePurple: {
                  base: "from-blue-600 to-purple-600",
                  hover: "hover:from-blue-700 hover:to-purple-700",
                  disable: "from-blue-800 to-purple-800",
                  baseText: "text-purple-600",
                  ring: "ring-2 ring-gradient-to-r",
                  name: 'bluePurple', 
                  color: "bg-purple-600",
            },
            greenTeal: {
                  base: "from-green-500 to-teal-500",
                  disable: "from-green-800 to-teal-800",
                  baseText: "text-green-600",
                  hover: "hover:from-green-700 hover:to-teal-700",
                  name: 'greenTeal',
                  color: "bg-green-600",
            },
            purplePink: {
                  base: "from-purple-600 to-pink-600",
                  disable: "from-purple-800 to-pink-800",
                  baseText: "text-pink-600",
                  hover: "hover:from-purple-700 hover:to-pink-700",
                  name: 'purplePink',
                  color: "bg-pink-600",
            }
      };
      
      const themeSaved = localStorage.getItem('theme');
      const [ theme, setTheme ] = useState(themeOptions[themeSaved] ?? themeOptions.bluePurple);

      const handleChangeTheme = (themeSelected) => {
            localStorage.setItem('theme', themeSelected);
            setTheme(themeOptions[themeSelected]);
      };

      return (
            <ThemeContext.Provider value={{ theme, handleChangeTheme, themeOptions }}>
                  { children }
            </ThemeContext.Provider>
      )
}