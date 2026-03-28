import { BookOpenCheck, CalendarArrowUp, CalendarCheck, CalendarClock, LogOutIcon, LogInIcon } from "lucide-react";
import { lazy, Suspense } from "react";
import { useBookingCount } from "../../hooks/dashboardQueries";

const Card = lazy(() => import("../../shared/Cards"));
const UpcomingTable = lazy(() => import("../../shared/UpcomingTable"));

export default function BookingsOverview(){
      const { data: bookingCount, isLoading } = useBookingCount();
      
      return (
            <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-3  pb-1 md:border-b border-stone-200  dark:border-stone-700">
                        <BookOpenCheck className="w-4 h-4 md:w-6 md:h-6 text-blue-600 dark:text-blue-500"/>
                        <h2 className="text-sm md:text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">Bookings Overview</h2>
                  </div>

                  <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
                        <Suspense fallback={null}>
                              <Card title={'This Week Bookings'} icon={<CalendarClock className="w-3 h-3 md:w-4 md:h-4 text-green-500 dark:text-white" />} iconBg={'bg-green-50 dark:bg-green-500'}>
                                    <p className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mt-3">{bookingCount?.this_week.bookings ?? "--"}</p>
                                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Guests: <span  className="font-semibold dark:text-green-400">{bookingCount?.this_week.guests ?? "--"}</span></p>
                              </Card>

                              <Card title={'This Month Bookings'} icon={<CalendarCheck className="w-3 h-3 md:w-4 md:h-4 text-purple-500 dark:text-white" />} iconBg={'bg-purple-50 dark:bg-purple-500'}>
                                    <p className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mt-3" >{bookingCount?.this_month.bookings ?? "--"}</p>
                                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Guests: <span  className="font-semibold dark:text-purple-400">{bookingCount?.this_month.guests ?? "--"}</span></p>
                              </Card>

                              <Card title={'This Year Bookings'} icon={<CalendarArrowUp className="w-3 h-3 md:w-4 md:h-4 text-blue-500 dark:text-white" />} iconBg={'bg-blue-50 dark:bg-blue-500'}>
                                    <p className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mt-3" >{bookingCount?.this_year.bookings ?? "--"}</p>
                                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Guests: <span  className="font-semibold dark:text-blue-400">{bookingCount?.this_year.guests ?? "--"}</span></p>
                              </Card>
                        </Suspense>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5 md:gap-6">
                        <Suspense fallback={null}>
                              <UpcomingTable title={"Upcoming Check-outs"} icon={<LogOutIcon className="w-4 h-4 md:w-6 md:h-6 text-red-500"/>} className={'bg-white dark:bg-stone-900 p-3 md:p-4 rounded-lg border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col gap-2'}/>
                              <UpcomingTable title={"Upcoming Arrivals"} icon={<LogInIcon className="w-4 h-4 md:w-6 md:h-6 text-blue-500"/>} className={'bg-white dark:bg-stone-900 p-3 md:p-4 rounded-lg border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col gap-2'}/>
                        </Suspense>
                  </div>      
            </div>
      );    
}