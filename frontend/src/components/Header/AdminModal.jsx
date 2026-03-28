import { BsPersonCircle } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { HiOutlineArrowRight } from "react-icons/hi";
import { useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { logoutAPI } from "../../services/authService";
import { usePageHeader } from "../../context/PageHeaderContext";
import { useAdminName } from "../../hooks/headerQueries";
import { useModal } from "../../context/ModalContext";

export default function AdminModal({ isOpen, setAdminModalOpen}) {
      const modalRef = useRef();
      const { openModal } = useModal();
      const { handleSetHeader } = usePageHeader();
      const isDesktop = window.innerWidth >= 768; // example breakpoint

      const { data: adminNameData } = useAdminName();
      const adminName = adminNameData?.data.username;

      // close notif modal when click outside in desktop view only
      useEffect(() => {
            function handleClickOutside(event){
                  if (modalRef && !modalRef.current.contains(event.target)){ // take the click and check if its the target
                        setAdminModalOpen(false); // close if not
                  }
            }
            
            if (isDesktop){
                  document.addEventListener("mousedown", handleClickOutside); // take the clicks
            }else{
                  document.removeEventListener("mousedown", handleClickOutside);
            }
            
            return () => {document.removeEventListener("mousedown", handleClickOutside);}; // remove to prevent duplicate eventListeners
      }, [isDesktop]);
      
      const handleLogOut = async () => {
            setTimeout(() => {
                  logoutAPI();
            }, 1000);
      };
      
      const handleConfirmLogout = () => {
            openModal({ 
                  name: 'confirm logout', 
                  payload: {
                        message: 'Are you sure you want to logout?',
                        buttonNameIdle: 'Logout',
                        buttonNameLoading: 'Logging out...',
                        clickEvent: handleLogOut
                  }
            })
      };

      return (
            <div className={` inset-0 z-10 ${isOpen ? "fixed bg-black/20 backdrop-blur-[2px]  pointer-events-auto" : "hidden"} md:bg-transparent md:backdrop-blur-none`}>
                  {/* Profile Card */}
                  <div ref={modalRef} className={` absolute w-[85%] md:w-48 rounded-xl bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 shadow-lg transition-all duration-300 overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-14 md:right-4 md:left-auto md:translate-x-1 md:translate-y-0 ${isOpen ? "opacity-100 scale-100  pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}>
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-stone-700 md:text-center">
                              <p className="text-[12px] uppercase tracking-wide text-gray-500 dark:text-gray-400">Administrator Profile</p>
                              <span onClick={() => setAdminModalOpen(!isOpen)}  className="text-black dark:text-gray-200 absolute right-2 top-0.5 text-lg md:hidden">&times;</span>
                        </div>

                        {/* Profile Info */}
                        <div className="flex flex-col items-center gap-2 py-6">
                              <BsPersonCircle className="w-14 h-14 text-blue-600" />
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{adminName}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                        </div>

                        {/* Actions */}
                        <div className="border-t border-gray-200 dark:border-stone-700 flex flex-col justify-center items-center">
                              <NavLink onClick={() => ( setAdminModalOpen(!isOpen), handleSetHeader('Admin Profile'))} to={'/admin/profile'}  className="flex items-center gap-2 p-3 hover:bg-stone-100 dark:hover:bg-stone-700 focus:bg-stone-100 dark:focus:bg-stone-700 cursor-pointer pointer-events-auto w-full justify-center">
                                    <span className="text-xs text-blue-500 font-medium">View Full Info</span>
                                    <HiOutlineArrowRight className="text-blue-500"/>
                              </NavLink>
                              <button onClick={handleConfirmLogout} className="flex items-center gap-2 p-3 hover:bg-stone-100 dark:hover:bg-stone-700  md:focus:bg-transparent md:dark:focus:bg-transparent focus:bg-stone-100 dark:focus:bg-stone-700 cursor-pointer pointer-events-auto w-full justify-center">
                                    <span className="text-xs text-red-500 font-semibold">Log-out</span>
                                    <FiLogOut className="text-red-500"/>
                              </button>
                        </div>
                  </div>

            </div>
      );
}

