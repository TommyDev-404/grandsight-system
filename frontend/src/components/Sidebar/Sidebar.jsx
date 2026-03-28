import { ChevronRight } from "lucide-react";
import { FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useToggleSidebar } from "../../context/ToggleSidebarContext";
import { usePageHeader } from "../../context/PageHeaderContext";

import Logo from "../Header/Logo";
import { GoHome, GoHomeFill } from "react-icons/go";
import { BsBarChart, BsBarChartFill } from "react-icons/bs";
import { PiCalendar, PiCalendarFill, PiWallet, PiWalletFill, PiUsers, PiUsersFill, PiMoneyLight, PiMoneyFill, PiBroomFill, PiBroomThin } from "react-icons/pi";
import { RiMoneyDollarCircleFill, RiMoneyDollarCircleLine } from "react-icons/ri";
import { useNotification } from "../../hooks/headerQueries";

const menuItems = [
      {
            name: "Home Dashboard",
            path: "/admin/dashboard",
            iconFill: <GoHomeFill className="w-5 h-5 shrink-0" />,
            iconOutline: <GoHome className="w-5 h-5 shrink-0" />,
      },
      {
            name: "Analytics & Reports",
            path: "/admin/analytics",
            iconFill: <BsBarChartFill className="w-5 h-5 shrink-0" />,
            iconOutline: <BsBarChart className="w-5 h-5 shrink-0" />,
      },
      {
            name: "Manage Bookings",
            path: "/admin/bookings",
            iconFill: <PiCalendarFill className="w-5 h-5 shrink-0" />,
            iconOutline: <PiCalendar className="w-5 h-5 shrink-0" />,
      },
      {
            name: "Housekeeping",
            path: "/admin/housekeeping",
            iconFill: <PiBroomFill className="w-5 h-5 shrink-0" />,
            iconOutline: <PiBroomThin className="w-5 h-5 shrink-0" />, // no separate outline available
      },
      {
            name: "Rates & Availability",
            path: "/admin/rates&availability",
            iconFill: <PiMoneyFill className="w-5 h-5 shrink-0" />,
            iconOutline: <PiMoneyLight className="w-5 h-5 shrink-0" />, // no outline available
      },
      {
            name: "Accounting",
            path: "/admin/accounting",
            iconFill: <PiWalletFill className="w-5 h-5 shrink-0" />,
            iconOutline: <PiWallet className="w-5 h-5 shrink-0" />,
      },
      {
            name: "Promo Management",
            path: "/admin/promo",
            iconFill: <RiMoneyDollarCircleFill className="w-5 h-5 shrink-0" />,
            iconOutline: <RiMoneyDollarCircleLine className="w-5 h-5 shrink-0" />, // no outline available
      },
      {
            name: "Staff Management",
            path: "/admin/staff",
            iconFill: <PiUsersFill className="w-5 h-5 shrink-0" />,
            iconOutline: <PiUsers className="w-5 h-5 shrink-0" />,
      },
];

const menuItemsMobile = [
      {
            name: "Rates & Availability",
            path: "/admin/rates&availability",
            iconFill: <PiMoneyFill className="w-5 h-5" />,
            iconOutline: <PiMoneyLight className="w-5 h-5" />, // no outline available
      },
      {
            name: "Accounting",
            path: "/admin/accounting",
            iconFill: <PiWalletFill className="w-5 h-5" />,
            iconOutline: <PiWallet className="w-5 h-5" />,
      },
      {
            name: "Promo Management",
            path: "/admin/promo",
            iconFill: <RiMoneyDollarCircleFill className="w-5 h-5" />,
            iconOutline: <RiMoneyDollarCircleLine className="w-5 h-5" />, // no outline available
      },
      {
            name: "Staff Management",
            path: "/admin/staff",
            iconFill: <PiUsersFill className="w-5 h-5" />,
            iconOutline: <PiUsers className="w-5 h-5" />,
      },
];

export default function Sidebar() {
      const { theme } = useTheme();
      const { sidebarOpen, toggleSidebar } = useToggleSidebar();

      return (
            <>
                  {/* Desktop Sidebar */}
                  <aside className={`hidden md:flex bg-white dark:bg-stone-900 dark:border-stone-700 ${sidebarOpen ? 'w-18 px-2' : 'w-70 px-4'} h-screen py-2  rounded-tl-lg rounded-bl-lg transition-all duration-300 ease-in-out border-2 border-stone-200 flex flex-col gap-2`}>
                        {/* Header */}
                        <div className="flex justify-between relative  dark:border-stone-600 ml-1.5">
                              <Logo isCollapsed={sidebarOpen}/>
                        </div>
                        <hr className="text-stone-200 dark:text-stone-600"/>
                        <h3 className={`text-xs text-stone-800 dark:text-stone-400 tracking-wide mt-4 transition-all duration-300 ease-in-out ${sidebarOpen ? 'opacity-0' : 'opacity-100'}`}>MENU</h3>

                        <nav className="flex flex-col gap-2 justify-center">
                              {menuItems.map((item) => (
                                    <SidebarItem key={item.name} path={item.path} iconFill={item.iconFill} iconOutline={item.iconOutline}  label={item.name} isCollapsed={sidebarOpen} navType={'Desktop'}/>
                              ))}
                        </nav>
                  </aside>
                  
                  {/* Mobile sidebar overlay */}
                  <div className={`md:hidden fixed inset-0 bg-black/20 pointer-events-auto backdrop-blur-[1px] ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} z-50  transition-opacity duration-300`}>
                  </div>

                  {/* Mobile sidebar */}
                  <aside className={`md:hidden fixed top-0 z-100 left-0 h-screen bg-white dark:bg-stone-900 w-60 py-3 px-2 flex  flex-col gap-2 transform transition-transform duration-300 ease-in-out  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        {/* Header */}
                        <div className="flex justify-between items-center">
                              <Logo/>
                              <button onClick={toggleSidebar} className={`rounded-xl cursor-pointer focus:bg-stone-200 dark:focus:bg-stone-700 mr-2 bg-linear-to-r ${theme.base} p-1`}>
                                    <FiX className="text-white w-5 h-5"/>
                              </button>
                        </div>
                        <hr className="text-stone-200  dark:text-stone-600"/>
                        <h3 className={`text-[10px] text-stone-800 dark:text-stone-400 tracking-wide mt-4 transition-all duration-300 ease-in-out`}>MENU</h3>

                        {/* Navigation bar */}
                        <nav className="flex flex-col gap-2">
                              {menuItemsMobile.map((item) => (
                                    <SidebarItem handleMobileSidebar={toggleSidebar} key={item.name} path={item.path} iconFill={item.iconFill} iconOutline={item.iconOutline} label={item.name} navType={'Mobile'} isCollapsed={sidebarOpen}/>
                              ))}
                        </nav>
                  </aside>
            </>
      );
}

function SidebarItem({ handleMobileSidebar, iconFill, iconOutline, label, path, isCollapsed, navType }){
      const { theme } = useTheme();
      const { handleSetHeader } = usePageHeader();
      const { data: notificationData } = useNotification();
      const notifData = notificationData?.data || [];
      
      const handleMobileClick = () => {
            handleSetHeader(label);
            handleMobileSidebar?.();
      };
      
      if (navType === 'Mobile') {
            return (
                  <div className="relative group">
                        <NavLink
                              onClick={handleMobileClick}
                              to={path}
                              className={({ isActive }) =>
                                    `relative py-3 px-4 w-full rounded-md flex items-center gap-3 cursor-pointer transform transition-opacity duration-200 ease-in-out ${
                                    isActive
                                          ? `bg-linear-to-r ${theme.base} ${theme.hover} text-white font-bold`
                                          : "text-stone-600 dark:text-stone-200"
                                    }`
                              }
                        >
                              {({ isActive }) => (
                                    <div className="relative flex items-center gap-2">
                                          {/* Show a red indicator based on notification */}
                                          {notifData.map((data, index) => (
                                                data.alert_type === 'bookings' && label === 'Manage Bookings' ? 
                                                      <span key={index} className="bg-red-500 p-1 rounded-full absolute z-10 -top-1 -left-2 "></span>
                                                :  data.alert_type === 'housekeeping' && label === 'Housekeeping' ?
                                                      <span key={index} className="bg-red-500 p-1 rounded-full absolute z-10 -top-1 -left-2 "></span>
                                                : data.alert_type === 'occupancy' && label === 'Revenue Management' ?
                                                      <span key={index} className="bg-red-500 p-1 rounded-full absolute z-10 -top-1 -left-2 "></span>
                                                : ''
                                          ))}
                                          {isActive ? iconFill : iconOutline}
                                          {isActive && localStorage.setItem('currentPage', label)}
                                          <span className="text-xs font-normal transition-all duration-300 ease-in-out whitespace-nowrap">
                                                {label}
                                          </span>
                                    </div>
                              )}
                        </NavLink>
                  </div>
            );
      }
      
      return (
            <div className="relative group">
                  <NavLink to={path} onClick={() => handleSetHeader(label)}>
                        {({ isActive }) => (
                        <div className={`relative py-3 px-4 w-full rounded-md flex items-end justify-between gap-2 cursor-pointer transform transition-all duration-200 ease-in-out
                              ${isActive ? `bg-linear-to-r ${theme.base} ${theme.hover} text-white font-bold` : `text-stone-600 dark:text-stone-200`} hover:bg-stone-100 dark:hover:bg-stone-800`}>
                              
                              <div className="flex items-center gap-2 relative">
                                    {/* Show a red indicator based on notification */}
                                    {notifData.map((data, index) => (
                                          data.alert_type === 'bookings' && label === 'Manage Bookings' ? 
                                                <span key={index} className="bg-red-500 p-1 rounded-full absolute z-10 -top-1 -left-2 "></span>
                                          :  data.alert_type === 'housekeeping' && label === 'Housekeeping' ?
                                                <span key={index} className="bg-red-500 p-1 rounded-full absolute z-10 -top-1 -left-2 "></span>
                                          : data.alert_type === 'occupancy' && label === 'Revenue Management' ?
                                                <span key={index} className="bg-red-500 p-1 rounded-full absolute z-10 -top-1 -left-2 "></span>
                                          : ''
                                    ))}
                                    {isActive ? iconFill : iconOutline}
                                    <span className={`text-[14px] transition-all duration-200 ease-in-out whitespace-nowrap ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                                    {label}
                                    </span>
                              </div>
                              <div className={`absolute right-1 ${isCollapsed ? 'hidden' : 'block'}`}>
                                    <ChevronRight className="w-3"/>
                              </div>
                        </div>
                        )}
                  </NavLink>

                  {/* Tooltip when collapsed */}
                  {isCollapsed && (
                        <span className={`absolute z-50 left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-linear-to-r ${theme.base}  text-white dark:bg-stone-700 text-sm rounded-4xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-all duration-200`}>
                              {label}
                        </span>
                  )}
            </div>
      );
}


