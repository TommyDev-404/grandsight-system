import { useTheme } from "../context/ThemeContext";

export default function MobileButton({ buttons, selectedButton, setSelectedButton }){
      const { theme } = useTheme();

      return (
            <div className="sticky top-1 mt-1 px-1 flex md:hidden justify-between gap-1 dark:border-stone-700 pb-1">
                  {buttons.map(tab => (
                        <button key={tab} onClick={() => setSelectedButton(tab)} className={`p-2 text-[12px] rounded-lg w-full ${selectedButton === tab ? `bg-linear-to-r ${theme.base} ${theme.hover}  text-white font-semibold` : ' bg-white dark:bg-stone-700 text-stone-800  dark:text-white font-normal' }`}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
                  ))}
            </div>
            
      );
}