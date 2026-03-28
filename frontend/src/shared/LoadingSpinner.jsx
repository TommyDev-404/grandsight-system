import { useTheme } from "../context/ThemeContext";


export default function LoadingSpinner() {
      const { theme } = useTheme();
      const color = theme.color;

      return (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center   backdrop-blur-sm px-6 text-center space-y-3">

                  <p className="text-base sm:text-lg md:text-xl font-semibold  text-gray-800 dark:text-gray-200 tracking-wide">Preparing your data</p>
                  <p className="text-xs sm:text-sm text-gray-400 max-w-xs sm:max-w-sm">Fetching the latest updates from the system</p>

                  <div className="flex items-center justify-center space-x-2 pt-2">
                        <span className={`rounded-full ${color} h-3 w-3 sm:h-4 sm:w-4 animate-wave delay-0`} />
                        <span className={`rounded-full ${color} h-3 w-3 sm:h-4 sm:w-4 animate-wave delay-200`} />
                        <span className={`rounded-full ${color} h-3 w-3 sm:h-4 sm:w-4 animate-wave delay-400`} />
                  </div>

            </div>
      );
}

export function OverlaySpinner({ size = 4, color = "bg-purple-600", message = null }) {
      return (
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="flex flex-col items-center space-y-4 bg-white dark:bg-stone-800 px-8 py-6 rounded-2xl shadow-xl">
                        
                        <div className="flex space-x-2">
                              <span className={`rounded-full ${color} h-${size} w-${size} animate-wave delay-0`} />
                              <span className={`rounded-full ${color} h-${size} w-${size} animate-wave delay-200`} />
                              <span className={`rounded-full ${color} h-${size} w-${size} animate-wave delay-400`} />
                        </div>
            
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 tracking-wide">
                              {message ? message : "Opening dialog..."}
                        </p>
            
                  </div>
            </div>
      );
}
