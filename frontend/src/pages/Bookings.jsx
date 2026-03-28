import { lazy, Suspense, useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalStorageContext";
import { useQueryClient } from "@tanstack/react-query";
import useDesktop from "../hooks/useDesktop";
import LoadingSpinner from '../shared/LoadingSpinner';
import { 
      bookingQueries ,
      useBookingMetric
} from "../hooks/bookingQueries";

const BookingMetricCards = lazy(() => import("../components/Bookings/MetricCards"));
const FilterAndAddBooking = lazy(() => import("../components/Bookings/Filter-Add"));;
const BookingTable = lazy(() => import("../components/Bookings/BookingTable"));


export default function ManageBookings(){
      const isDesktop = useDesktop();
      const { selectedButton, setButtons, setSelectedButton } = useGlobalContext();
      const [ year, setYear ] = useState(new Date().getFullYear());
      const [ month, setMonth ] = useState(new Date().getMonth() + 1);
      const [ day, setDay ] = useState(null);
      const queryClient = useQueryClient();

      useEffect(() =>  {
            setButtons(['Overview', 'Bookings']);
            setSelectedButton('Overview')
      }, []);
      
    // Prefetch all booking queries
      useEffect(() => {
            async function prefetchBooking() {
                  try {
                        await Promise.all([
                              queryClient.prefetchQuery(bookingQueries.summaryCards()),
                              queryClient.prefetchQuery(bookingQueries.data({ category: "all", currentPage: 1, year, month, day, nameSearch: "" })),
                              queryClient.prefetchQuery(bookingQueries.areaSpaces()),
                        ]);
                  } catch (error) {
                        console.error("Booking prefetch failed:", error);
                  }
            }

            prefetchBooking();
      }, []);

      // --- Use hooks normally ---
      const { data: bookingMetricData, isLoading: bookingMetricLoading } = useBookingMetric();

      // --- Page loading state based on all loading flags ---
      const pageLoading = bookingMetricLoading;

      if (pageLoading) return <LoadingSpinner/>;
      
      return (
		<section>
                  {/* Desktop View */}
                  {isDesktop &&
                        <Suspense fallback={<LoadingSpinner/>}>
                              <div className="hidden md:block space-y-3 fade-in">
                                    {/* Metric Cards */}
                                    <BookingMetricCards/>
                                    <FilterAndAddBooking setYear={setYear} setMonth={setMonth} setDay={setDay} year={year} month={month} day={day}/>
                                    <BookingTable year={year} month={month} day={day} /> 
                              </div>
                        </Suspense>
                  }

                  {/* Mobile View */}	
                  {!isDesktop &&
                        <div className="block md:hidden">
                              {/* Metric Cards */}
                              {selectedButton === 'Overview' && (
                                    <Suspense fallback={<LoadingSpinner />}>
                                          <div className="fade-in">
                                                <BookingMetricCards />
                                          </div>
                                    </Suspense>
                              )}
                              
                              {selectedButton === 'Bookings' && 
                                    <Suspense fallback={<LoadingSpinner/>}>
                                          <div className="fade-in">
                                                <FilterAndAddBooking setYear={setYear} setMonth={setMonth} setDay={setDay} year={year} month={month} day={day}/>
                                                <BookingTable year={year} month={month} day={day} /> 
                                          </div>
                                    </Suspense>
                              }
                        </div>
                  }
            </section>
      );
}
