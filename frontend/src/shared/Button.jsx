import { useTheme } from "../context/ThemeContext";


export default function Button({ icon, text, type, clickEvent=null, className, disable=false}){
      const { theme } = useTheme();

      return (
            <button type={type} disabled={disable} onClick={clickEvent}  
                  className={`
                        ${className} 
                        ${disable ? `bg-linear-to-r ${theme.disable} `
                              : `bg-linear-to-r ${theme.base} ${theme.hover}`}  
                        text-white text-sm rounded-md flex justify-center items-center gap-2 transition-all active:scale-95
                  `}
            >
                  {icon} {text}
            </button>
      );    
}