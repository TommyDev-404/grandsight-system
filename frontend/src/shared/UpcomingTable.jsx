import { useState, useEffect, lazy } from "react";
import { useUpcomingBooking } from "../hooks/dashboardQueries";


const LoadingSpinner = lazy(() => import("./LoadingSpinner"));

export default function UpcomingTable({ title, icon, className, componentUsed="dashboard"}) {
      const [ day, setDay ] = useState('today');
      const type = title === 'Upcoming Arrivals' ? 'reservation' : 'checkout';

      // React Query
      const { data, isLoading } = useUpcomingBooking(type, day);
      const upcomingBookings = data?.upcoming || [];

      return (
            <div className={`${className}`}>
                  {/* Header */}
                  <div className={`flex justify-between items-center`}>
                        {componentUsed === 'dashboard' && <h3 className="text-sm md:text-lg font-semibold text-gray-700 dark:text-gray-100 flex items-center gap-2">{icon} {title}</h3>}
                        <select value={day} onChange={(e) => setDay(e.target.value)} className="py-1.5 px-2 md:px-3 text-xs md:text-sm border border-stone-200 dark:border-stone-700 rounded-md dark:bg-stone-800 bg-gray-50 dark:text-stone-100">
                              <option value="today">Today</option>
                              <option value="tomorrow">Tomorrow</option>
                        </select>
                  </div>
            
                  {/* ===== MOBILE VIEW (Cards) ===== */}
                  <div className="space-y-3 md:hidden max-h-[35vh] overflow-y-auto scrollbar-hide">
                        {isLoading ? (
                              <LoadingSpinner size="h-10 w-10"/>
                              ) : upcomingBookings && upcomingBookings.length > 0 ? (
                                    upcomingBookings.map((item, index) => (
                                          <div key={index} className="border border-stone-200 dark:border-stone-700 rounded-sm p-3 bg-gray-50 dark:bg-stone-800">
                                                <div className="flex justify-between">
                                                      <p className="font-semibold text-stone-800 dark:text-stone-200">{item.name}</p>
                                                </div>

                                                <div className="mt-2 text-xs text-stone-600 dark:text-stone-300 space-y-1 font-medium">
                                                      <p>Type: <span className="font-normal">{item.booking_type === "Check-in" ? 'Overnight' : 'Day Guest'}</span></p>
                                                      <p>Check-In: <span className="font-normal">{new Date(item.check_in).toLocaleDateString('en-US', { month: 'short', day: "2-digit", year: "numeric"})}</span></p>
                                                      <p>Check-Out: <span className="font-normal">{new Date(item.check_out).toLocaleDateString('en-US', { month: 'short', day: "2-digit", year: "numeric"})}</span></p>
                                                      <p>Guests: <span className="font-normal">{item.total_guest}</span></p>
                                                </div>
                                          </div>
                                    ))
                              ) : (
                                    <div className="border border-stone-200 dark:border-stone-700 rounded-sm px-3 py-14 bg-gray-50 dark:bg-stone-800">
                                          <p className="text-center text-stone-600 dark:text-stone-400 text-xs">No scheduled bookings.</p>
                                    </div>
                        )}
                  </div>
            
                  {/* ===== DESKTOP VIEW (Table) ===== */}
                  <div className="hidden md:block overflow-y-auto h-[30vh]">
                        <table className="w-full text-sm text-left">
                              <thead className="text-xs uppercase bg-stone-800 dark:bg-white/20 text-white">
                                    <tr>
                                          <th className="px-3 py-2 text-center">Guest</th>
                                          <th className="px-3 py-2 text-center">Type</th>
                                          <th className="px-3 py-2 text-center">Check-In</th>
                                          <th className="px-3 py-2 text-center">Check-Out</th>
                                          <th className="px-3 py-2 text-center">Guests</th>
                                    </tr>
                              </thead>
                              <tbody>
                                    {isLoading ? (
                                          <tr>
                                                <td>
                                                      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                                            <LoadingSpinner size="h-20 w-20"/>
                                                      </div>
                                                </td>
                                          </tr>
                                    ) : upcomingBookings && upcomingBookings.length > 0 ? (
                                          upcomingBookings.map((item, index) => (
                                                <tr key={index} className="border-b border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800">
                                                      <td className="p-3 text-center">{item.name}</td>
                                                      <td className="p-3 text-center">{item.booking_type === 'Check-in' ? 'Overnight' : 'Day Guest'}</td>
                                                      <td className="p-3 text-center">{new Date(item.check_in).toLocaleDateString('en-US', { month: 'short', day: "2-digit", year: "numeric"})}</td>
                                                      <td className="p-3 text-center">{new Date(item.check_out).toLocaleDateString('en-US', { month: 'short', day: "2-digit", year: "numeric"})}</td>
                                                      <td className="p-3 text-center">{item.total_guest}</td>
                                                </tr>
                                          ))
                                    ) : (
                                          <tr  className="border-b border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800">
                                                <td colSpan={5} className="p-3 text-center text-stone-700 dark:text-stone-400">No scheduled bookings.</td>
                                          </tr>
                                    )}
                              </tbody>
                        </table>
                  </div>
            </div>
      );
}
