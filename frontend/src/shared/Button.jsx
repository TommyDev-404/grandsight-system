import { useTheme } from "../context/ThemeContext";

export default function Button({
      icon = null,
      text,
      type,
      clickEvent = null,
      className,
      disable = false,
      typeOfButton = "submitForm",
}) {
      const { theme } = useTheme();

      const baseStyles = "text-sm rounded-md flex justify-center items-center gap-2 transition-all active:scale-95";
      
      const submitStyles = disable
            ? `bg-linear-to-r ${theme.disable} text-white`
            : `bg-linear-to-r ${theme.base} ${theme.hover} text-white`;

      const buttonStyles = type !== "button"
            ? submitStyles
            : type  === "button"
            ? `border border-green-300 ${theme.baseText} ${theme.bgHover} `
            : "";

      return (
            <button
                  type={type}
                  disabled={disable}
                  onClick={clickEvent}
                  className={`${className} ${baseStyles} ${buttonStyles}`}
            >
                  {icon} {text}
            </button>
      );
}

/*
export default function Button({ icon=null, text, type, clickEvent=null, className, disable=false, typeOfButton = 'submitForm' }){
      const { theme } = useTheme();

      return (
            <button type={type} disabled={disable} onClick={clickEvent}  
                  className={`
                        ${className} 
                        border border-green-300
                        ${theme.baseText} text-sm rounded-md flex justify-center items-center gap-2 transition-all active:scale-95
                  `}
            >
                  {icon && icon} {text}
            </button>
      );    
} */