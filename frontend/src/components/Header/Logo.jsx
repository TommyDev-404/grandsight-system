import { useTheme } from "../../context/ThemeContext";
import resortLogo from "../../assets/resortLogo.webp";

export default function Logo({isCollapsed}){
      const { theme } = useTheme();
      return (
            <div className="flex  items-center gap-3 transition-all duration-200 ease-in-out">
                  {/* Logo image is ALWAYS shown */}
                  <img src={resortLogo} loading="lazy" alt="Logo" className="w-10 h-10 rounded-full shadow-lg"/>

                  <div className={`leading-tight flex flex-col whitespace-nowrap transition-all duration-300 ease-in-out ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                        <span className={`text-sm font-bold tracking-wide bg-clip-text text-transparent bg-linear-to-r ${theme.base}`}>GrandSight</span>
                        <span className="text-xs text-stone-800 dark:text-stone-300">Laguna Resort</span>
                  </div>
            </div>
      );
}