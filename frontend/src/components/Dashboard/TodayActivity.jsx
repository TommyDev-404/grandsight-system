import { LogIn, LogOut, BedDouble, Sun, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Suspense, lazy } from "react";
import { useTodayActivity } from "../../hooks/dashboardQueries";

const Cards = lazy(() => import("../../shared/Cards"));4

export default function TodaysActivity() {
      const { data: todayActivity, isLoading, isFetching } = useTodayActivity();
      
      return (
            <section>
                  <h2 className="text-sm md:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Today’s Activity</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Suspense fallback={null}>
                              {/* Today’s Check-Ins */}
                              <Cards title="Today’s Check-Ins" icon={<LogIn className="w-3 h-3 md:w-4 md:h-4 text-blue-500 dark:text-white" />} iconBg="bg-blue-100 dark:bg-blue-600" order="order-1 md:order-none">
                                    <p className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-3">{todayActivity?.today_checkin.bookings ?? "--"}</p>
                                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-2">Guests:<span className="font-semibold ml-1 text-blue-500">{todayActivity?.today_checkin.guest ?? "--"}</span></p>

                                    <div className="mt-2 flex justify-end items-center gap-1 text-xs md:text-sm">
                                          {todayActivity?.today_checkin.change > 0 ?
                                                <>
                                                      <ArrowUpRight className={`text-green-500 font-bold`}/>
                                                      <span className="font-semibold text-green-500 dark:text-green-400" >+{todayActivity?.today_checkin.change}</span>
                                                </>
                                                :
                                                <>
                                                      <ArrowDownLeft className={`text-red-500 font-bold`}/>
                                                      <span className="font-semibold text-red-500 dark:text-red-400" >{todayActivity?.today_checkin.change}</span>
                                                </>
                                          }
                                          <span className="text-gray-500 ml-1">vs Yesterday</span>
                                    </div>
                              </Cards>

                              {/* Check-Outs */}
                              <Cards title="Check-Outs Completed" icon={<LogOut className="w-3 h-3 md:w-4 md:h-4 text-red-500 dark:text-white" />} iconBg="bg-red-100 dark:bg-red-600" order="order-2 md:order-none">
                                    <div className="space-y-1 text-sm mt-3">
                                          <div className="flex justify-between">
                                                <span className="text-xs md:text-sm text-stone-700 dark:text-stone-300">Day Guest</span>
                                                <span className="font-semibold text-base text-stone-900 dark:text-stone-200">{todayActivity?.checkout.day_guest ?? "--"}</span>
                                          </div>
                                          <div className="flex justify-between">
                                                <span className="text-xs md:text-sm text-stone-700 dark:text-stone-300">Overnight</span>
                                                <span className="font-semibold text-base text-stone-900 dark:text-stone-200">{todayActivity?.checkout.overnight ?? "--"}</span>
                                          </div>
                                    </div>
                                    <hr className="my-3 border-stone-200 dark:border-stone-700" />
                                    <p className="text-xs md:text-sm text-gray-500">Guests:<span className="ml-1 font-semibold text-red-500">{todayActivity?.checkout.total_guests ?? "--"}</span></p>
                              </Cards>

                              {/* Overnight Check-Ins */}
                              <Cards title="Overnight Check-Ins" icon={<BedDouble className="w-3 h-3 md:w-4 md:h-4  text-indigo-500 dark:text-white" />} iconBg="bg-indigo-100 dark:bg-indigo-600" order="order-3 md:order-none">
                                    <p className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-3">{todayActivity?.overnight.count ?? "--"}</p>
                                    <p className="text-xs md:text-sm text-gray-500 mt-2">Guests:<span className="ml-1 font-semibold text-indigo-500">{todayActivity?.overnight.guest ?? "--"}</span></p>
                              </Cards>

                              {/* Day Guest Entries */}
                              <Cards title="Day Guest Entries" icon={<Sun className="w-3 h-3 md:w-4 md:h-4 text-amber-500 dark:text-white" />} iconBg="bg-amber-100 dark:bg-amber-600" order="order-4 md:order-none">
                                    <p className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-3">{todayActivity?.day_guest.count ?? "--"}</p>
                                    <p className="text-xs md:text-sm text-gray-500 mt-2">Guests:<span className="ml-1 font-semibold text-amber-500">{todayActivity?.day_guest.guest ?? "--"}</span></p>
                              </Cards>
                        </Suspense>
                  </div>
            </section>
      );
}
