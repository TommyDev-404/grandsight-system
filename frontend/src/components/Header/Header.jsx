import { lazy, Suspense, useState } from "react";
import { Moon, Sun } from 'lucide-react';
import { BsPersonFill } from "react-icons/bs"; // FontAwesome astronaut icon
import { useTheme } from "../../context/ThemeContext";
import { useDarkMode } from "../../context/DarkModeContext";
import { BiMenuAltLeft } from "react-icons/bi";
import { useToggleSidebar } from "../../context/ToggleSidebarContext";
import { usePageHeader } from "../../context/PageHeaderContext";
import { PiBellSimpleFill } from "react-icons/pi";
import { useAdminName, useNotification } from "../../hooks/headerQueries";
import PageHeader from '../../shared/PageHeader';

const NotificationModal = lazy(() => import('./NotificationModal'));
const AdminModal = lazy(() => import('./AdminModal'));

export default function Header() {
      const { theme } = useTheme();
      const { header } = usePageHeader();
      const { toggleSidebar } = useToggleSidebar();
      const { currentMode, toggleDarkMode } = useDarkMode();
      const [ isNotifOpen, setNotifOpen ] = useState(false);
      const [ isAdminModalOpen, setAdminModalOpen] = useState(false);

      const { data: notificationData, isLoading } = useNotification();
      const { data: adminNameData } = useAdminName();
      const notifications = notificationData?.data ||  [];
      const adminUsername = adminNameData?.data;

      return (
            <header className="sticky top-0 inset-x-0 z-20 md:rounded-tr-lg bg-white dark:bg-stone-900 transition-colors duration-300 py-2 px-2 md:px-2 md:py-2 border-b-2 md:border-t-2 md:border-r-2  border-stone-200 dark:border-stone-600 flex justify-between items-center">
                  {/* Hamburger Menu for mobile */}
                  <div className="flex items-center gap-2 md:gap-4">
                        <button onClick={toggleSidebar} className={`rounded-lg p-1  bg-linear-to-r ${theme.base}  ${theme.hover}`}>
                              <BiMenuAltLeft className={`w-6 h-6 md:w-7 md:h-7 text-white`}/>
                        </button>
                        <PageHeader pageName={header}/>
                  </div>

                  <div className="flex gap-1 md:gap-3 items-center md:mr-2">
                        <button onClick={() => toggleDarkMode()} className={` rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center  focus:ring-2 focus:ring-${theme}-400 transition-shadow duration-200 ease-in-out`}>
                              {currentMode === 'dark' ? <Sun className="w-5 h-5 md:w-6 md:h-6 text-gray-800 dark:text-white"/> : <Moon className="w-5 h-5 md:w-6 md:h-6 text-gray-800 dark:text-white"/>}
                        </button>

                        <button onClick={() => setNotifOpen(true)}  className={`cursor-pointer  dark:border-stone-700 rounded-full  w-8 h-8 md:w-10 md:h-10  flex items-center justify-center relative z-10 focus:ring-2 focus:ring-${theme}-400 transition-shadow duration-200 ease-in-out `} >
                              <PiBellSimpleFill className="w-5 h-5 md:w-6 md:h-6 text-gray-800 dark:text-white "/>
                              {notifications.length > 0 && 
                                    <span className="absolute -top-1 left-3 md:left-4 text-[11px] md:text-[12px] px-1.5 py-0.5 bg-red-500 border-2 border-white dark:border-gray-900 text-white font-bold md:py-0.5 md:px-1.5 rounded-3xl">{notifications.length}</span>
                              }
                        </button>
                        <NotificationModal isOpen={isNotifOpen} setNotifOpen={setNotifOpen}/>

                        <button  onClick={() => setAdminModalOpen(true)} className={`bg-linear-to-r ${theme.base}  ${theme.hover} rounded-full  w-7 h-7 md:w-45 md:h-10  flex items-center justify-center gap-3  focus:ring-2  focus:ring-${theme.base} transition-shadow duration-200 ease-in-out`}>
                              <BsPersonFill className="w-5 h-4 md:w-6 md:h-5 text-white"/>
                              <div className="hidden md:flex flex-col">
                                    <span className="text-white font-semibold text-xs">{adminUsername?.username}</span>
                                    <span className="text-white text-[11px]">Administrator</span>
                              </div>
                              {/* Optional: Down arrow for dropdown */}
                              <svg className="w-4 h-4 text-white hidden md:block text[10px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> 
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                        </button>
                        <AdminModal isOpen={isAdminModalOpen} setAdminModalOpen={setAdminModalOpen}/>
                  </div>
            </header>
      );
}
