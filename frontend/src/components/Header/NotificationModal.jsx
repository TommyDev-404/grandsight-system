import { Bell, Bubbles, Building, CircleAlertIcon, Inbox } from "lucide-react";
import {useRef, useEffect } from 'react';
import { useTheme } from "../../context/ThemeContext";
import { useNotification } from "../../hooks/headerQueries";

const  timeAgo = (inputTime) => {
      const date = new Date(inputTime);
      const now = new Date();
      const diffSec = Math.floor((now - date) / 1000);
      const absSec = Math.abs(diffSec); // convert into seconds

      if (Math.round(absSec / 60) < 60) return `${Math.round(absSec / 60)} seconds ago`;
      if (absSec < 3600) return `${Math.floor(absSec / 60)} minutes ago`;
      if (absSec < 86400) return `${Math.floor(absSec / 3600)} hours ago`;
      return `${Math.floor(absSec / 86400)} days ago`;
}

export default function NotificationsModal({ isOpen, setNotifOpen}) {
      const { data, isLoading } = useNotification();
      const notifications = data?.data ||  [];

      const { theme } = useTheme();
      const modalRef = useRef(); // acts as a pointer to whenever dom element you put it
      const isDesktop = window.innerWidth >= 768; // takes the current width of the screen

      // close notif modal when click outside in desktop view only
      useEffect(() => {
            function handleClickOutside(event){
                  if (modalRef && !modalRef.current.contains(event.target)){ // take the click and check if its the target
                        setNotifOpen(false); // close if not
                  }
            }
            
            if(isDesktop){
                  document.addEventListener("mousedown", handleClickOutside); // take the clicks
            }else{
                  document.removeEventListener("mousedown", handleClickOutside); // take the clicks
            }
            
            return () => {document.removeEventListener("mousedown", handleClickOutside);}; // remove to prevent duplicate eventListeners
      }, [isDesktop]);
      
      return (
            <div className={`inset-0 z-10 ${isOpen ? 'fixed bg-black/20 backdrop-blur-[2px] pointer-events-auto ' : 'hidden' } md:bg-transparent md:backdrop-blur-none`}>
                  <div ref={modalRef}  className={`absolute top-1/2 left-1/2  -translate-y-1/2 -translate-x-1/2  md:top-53 md:right-4 md:left-auto  md:-translate-x-10  w-[90%] overflow-y-auto md:w-80 rounded-xl bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 shadow-lg overflow-hidden  transition-all duration-300 ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                        {/* Header */}
                        <div className={`flex items-center md:justify-center gap-2 px-4 py-3 border-b border-stone-200 dark:border-stone-700  bg-linear-to-r ${theme.base}`}>
                              <Bell className="w-5 h-5 text-white" />
                              <h2 className="font-semibold text-white">Notifications</h2>
                              <span className="absolute text-xl right-3 top-1 md:hidden text-white" onClick={() => setNotifOpen(false)}>&times;</span>
                        </div>

                        {/* Notifications list */}
                        <div className="h-64 overflow-y-auto scrollbar-hide">
                              {/* EMPTY STATE */}
                              {notifications.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-full text-stone-500 dark:text-stone-400">
                                          <Inbox size={36} className="mb-2 opacity-60" />
                                          <span className="text-sm">No notifications</span>
                                    </div>
                              )}

                              {/* LIST */}
                              {notifications.map((note, index) => (
                              <div key={index} className="flex gap-3 px-4 py-3 border-b border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer">
                                    {/* ICON */}
                                    <div className="mt-1">
                                          {note.alert_type === 'housekeeping' ?
                                                <Bubbles size={25} className="text-blue-500" /> 
                                          : note.alert_type === 'bookings' ?
                                                <Building size={25} className="text-green-500" />
                                          : 
                                                <CircleAlertIcon size={25} className="text-red-500" />
                                          }
                                    </div>

                                    {/* CONTENT */}
                                    <div className="flex flex-col gap-1">
                                          <span className="text-sm text-stone-800 dark:text-stone-200">{note.name}</span>
                                          <span className="text-xs text-stone-500">{timeAgo(note.date)}</span>
                                    </div>
                              </div>
                              ))}

                        </div>

                  </div>
            </div>
      );
}
