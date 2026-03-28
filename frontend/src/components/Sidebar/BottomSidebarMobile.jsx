import { GoHome, GoHomeFill } from "react-icons/go";
import { BsBarChart, BsBarChartFill } from "react-icons/bs";
import { PiBroomThin, PiBroomFill, PiCalendar, PiCalendarFill } from "react-icons/pi";
import { useTheme } from "../../context/ThemeContext";
import { usePageHeader } from "../../context/PageHeaderContext";
import { useNotification } from "../../hooks/headerQueries";
import { NavLink } from "react-router-dom";

export default function BottomNavbar() {
      const { theme } = useTheme();
      const { handleSetHeader } = usePageHeader();
      const { data: notificationData } = useNotification();
      const notifData = notificationData?.data || [];

      const menuItems = [
            {
                  name: "Home",
                  completeName: 'Home Dashboard',
                  path: "/admin/dashboard",
                  iconFill: <GoHomeFill className="w-5 h-5 shrink-0 fill-current" />,
                  iconOutline: <GoHome className="w-5 h-5 shrink-0 stroke-current" />,
            },
            {
                  name: "Analytics",
                  completeName: 'Analytics & Reports',
                  path: "/admin/analytics",
                  iconFill: <BsBarChartFill className="w-5 h-5 shrink-0 fill-current" />,
                  iconOutline: <BsBarChart className="w-5 h-5 shrink-0 stroke-current" />,
            },
            {
                  name: "Bookings",
                  completeName: 'Manage Bookings',
                  path: "/admin/bookings",
                  iconFill: <PiCalendarFill className="w-5 h-5 shrink-0 fill-current" />,
                  iconOutline: <PiCalendar className="w-5 h-5 shrink-0 stroke-current" />,
            },
            {
                  name: "Housekeeping",
                  completeName: 'Housekeeping',
                  path: "/admin/housekeeping",
                  iconFill: <PiBroomFill className="w-5 h-5 shrink-0 fill-current" />,
                  iconOutline: <PiBroomThin className="w-5 h-5 shrink-0 stroke-current" />,
            },
      ];

      // check notifications once per type for efficiency
      const hasBookingNotif = notifData.some((n) => n.alert_type === "bookings");
      const hasHousekeepingNotif = notifData.some((n) => n.alert_type === "housekeeping");

      return (
            <nav className="md:hidden sticky bottom-0 left-0 w-full z-10 bg-white/80 dark:bg-stone-900/90 backdrop-blur-lg border-t border-stone-200 dark:border-stone-800">
                  <div className="flex justify-around items-center py-0.5">
                        {menuItems.map((item) => (
                              <NavLink
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => handleSetHeader(item.completeName)}
                              >
                                    {({ isActive }) => {
                                          // active color for icon and text
                                          const activeColor = isActive ? theme.baseText : "text-stone-600 dark:text-stone-400";

                                          // Only update when this NavLink is active
                                          if (isActive) {
                                                localStorage.setItem('currentPage', item.completeName);
                                          }

                                          return (
                                                <div className="flex flex-col items-center justify-center gap-1 px-4 py-1 relative transition-all duration-200">
                                                      {/* Icon */}
                                                      <span className={`text-lg ${activeColor}`}>
                                                      {isActive ? item.iconFill : item.iconOutline}
                                                      </span>

                                                      {/* Notification dot */}
                                                      {item.name === "Bookings" && hasBookingNotif && (
                                                      <span className="bg-red-500 p-1 rounded-full absolute z-10 top-1 left-4" />
                                                      )}
                                                      {item.name === "Housekeeping" && hasHousekeepingNotif && (
                                                      <span className="bg-red-500 p-1 rounded-full absolute z-10 top-1 left-8" />
                                                      )}

                                                      {/* Text */}
                                                      <span className={`text-[11px] font-semibold ${activeColor}`}>
                                                      {item.name}
                                                      </span>
                                                </div>
                                          );
                                    }}
                              </NavLink>
                        ))}
                  </div>
            </nav>
      );
}