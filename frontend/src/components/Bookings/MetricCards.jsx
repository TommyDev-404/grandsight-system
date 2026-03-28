import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { BookCheckIcon, BookMarkedIcon, LogOut, UserCheckIcon, LogInIcon } from "lucide-react";
import { useBookingMetric } from "../../hooks/bookingQueries";
import { useDarkMode } from "../../context/DarkModeContext";
import CardSideButton from "./CardSideButton";
import CardSideIcon from "./CardSideIcon";

export default function BookingMetricCards(){
      const { currentMode } = useDarkMode();
      const { data: summaryCardData } = useBookingMetric();

      return (
            <SkeletonTheme baseColor={currentMode === 'dark' ? "#374151" : "#e5e7eb"} highlightColor={currentMode === 'dark' ? "#4b5563" : "#ffffff"} duration={1}>
                  <div className="grid md:grid-cols-13 gap-4">
                        <CardSideIcon title={'Today`s Check-in'} icon={<UserCheckIcon className="w-4 h-4 md:w-5 md:h-5  text-teal-500 dark:text-white"/>} iconBg={'bg-teal-100 dark:bg-teal-500'} colSpan={'md:col-span-2'}>
                              <div className="flex justify-around ">
                                    <div className="flex flex-col items-center">
                                          <span className="text-2xl font-bold text-gray-800 dark:text-white">{summaryCardData?.today_checkin ?? "--"}</span>
                                          <p className="text-xs text-gray-500 dark:text-gray-400">Check-ins</p>
                                    </div>
                        
                                    <div className="flex flex-col items-center">
                                          <span className="text-2xl font-bold text-gray-800 dark:text-white" >{summaryCardData?.today_checkin_guests ?? "--"}</span>
                                          <p className="text-xs text-gray-500 dark:text-gray-400">Guests</p>
                                    </div>
                              </div>
                        </CardSideIcon>

                        <CardSideIcon title={'Today`s Booking Overview'} icon={<BookCheckIcon className="w-4 h-4 md:w-5 md:h-5   text-blue-500 dark:text-white"/>} iconBg={'bg-blue-100 dark:bg-blue-500'} colSpan={'md:col-span-3'}>
                              <div className="flex justify-around text-center gap-4">
                                    <div>
                                          <span className="text-gray-600 dark:text-gray-200 text-sm">Overnight</span>
                                          <p className="text-xs text-gray-400 dark:text-gray-500" >({summaryCardData?.overnight_guests ?? "--"} guests)</p>
                                          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2 block" >{summaryCardData?.overnight_count ?? "--"}</span>
                                    </div>

                                    <div>
                                          <span className="text-gray-600 dark:text-gray-200 text-sm">Day Guests</span>
                                          <p className="text-xs text-gray-400 dark:text-gray-500" >({summaryCardData?.day_guest_total ?? "--"} guests)</p>
                                          <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2 block" >{summaryCardData?.day_guest_count ?? "--"}</span>
                                    </div>
                              </div>
                        </CardSideIcon>
                        
                        <CardSideButton title={'Today`s Check-Out'} count={summaryCardData?.checkouts} modalTitle={'Upcoming Checkouts'} modalIcon={<LogOut className="w-5 h-5  text-red-500"/>}  icon={<LogOut className="w-4 h-4 md:w-5 md:h-5  text-red-500 dark:text-white"/>} iconBg={'bg-red-100 dark:bg-red-500'} colSpan={'md:col-span-4'}>
                              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mt-3">
                                    <div className="flex justify-between items-center">
                                    <span className="text-sm">Day Guest</span>
                                    <span className="font-semibold" >{summaryCardData?.checkout_day_guest_count ?? "--"}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                    <span className="text-sm">Overnight</span>
                                    <span className="font-semibold" >{summaryCardData?.checkout_overnight_count ?? "--"}</span>
                                    </div>
                              </div>
                              <hr className="my-4 border-gray-200 dark:border-gray-700"/>
                              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                                          <span>Total Guests</span>
                                          <span  className="font-semibold text-red-500 dark:text-red-400">{summaryCardData?.today_checkout_guests ?? "--"}</span>
                              </div>
                        </CardSideButton>

                        <CardSideButton title={'Reservation`s Info'} count={summaryCardData?.arrivals} modalTitle={'Upcoming Arrivals'} modalIcon={<LogInIcon className="w-5 h-5  text-blue-500"/>}  icon={<BookMarkedIcon className="w-4 h-4 md:w-5 md:h-5  text-green-500 dark:text-white"/>} iconBg={'bg-green-100 dark:bg-green-500'} colSpan={'md:col-span-4'}>
                              <div className="flex justify-around text-center gap-8">
                                    <div>
                                          <span className="text-gray-600 dark:text-gray-200 text-sm">All Reservation</span>
                                          <p className="text-xs text-gray-400 dark:text-gray-500" >({summaryCardData?.upcoming_reservation_guests ?? "--"} guests)</p>
                                          <span className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2 block" >{summaryCardData?.upcoming_reservations ?? "--"}</span>
                                    </div>

                                    <div>
                                          <span className="text-gray-600 dark:text-gray-200 text-sm">Cancelled</span>
                                          <p className="text-xs text-gray-400 dark:text-gray-500" >({summaryCardData?.cancelled_guests ?? "--"} guests)</p>
                                          <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2 block" >{summaryCardData?.cancelled_count ?? "--"}</span>
                                    </div>
                              </div>
                        </CardSideButton>
                  </div>
            </SkeletonTheme>
      );
}