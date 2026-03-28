import { lazy, Suspense, useEffect } from "react";
import { Calendar1Icon } from "lucide-react";
import { useGlobalContext } from "../context/GlobalStorageContext";
import { useQueryClient } from '@tanstack/react-query';
import useDesktop from '../hooks/useDesktop';
import LoadingSpinner from '../shared/LoadingSpinner';
import TableTitle from "../shared/TableTitle";
import {
      useRatesAvailabilityMetric, 
      useAreaRatesAvailabilityInfo, 
      ratesAvailabilityQueries 
} from "../hooks/ratesQueries";

const MetricCard = lazy(() => import("../components/Rates&Availability/MetricCard"));
const RoomDetailsTable = lazy(() => import("../components/Rates&Availability/RoomDetails"));


export default function RatesAndAvailability(){
      const isDesktop = useDesktop();
      const { setButtons, selectedButton, setSelectedButton } = useGlobalContext();
      const queryClient = useQueryClient();

      useEffect(() =>  {
            setButtons(['Availability Overview', 'Area Details']);
            setSelectedButton('Availability Overview')
      }, []);

      useEffect(() => {
            async function prefetchRatesAvailability() {
                  try {
                        await Promise.all([
                              queryClient.prefetchQuery(ratesAvailabilityQueries.metric()),
                              queryClient.prefetchQuery(ratesAvailabilityQueries.areaInfo()),
                        ]);
                  } catch (error) {
                        console.error("Prefetch failed:", error);
                  }
            }

            prefetchRatesAvailability();
      }, []);

      const { data: ratesAvailabilityMetric, isLoading: ratesAvailabilityMetricLoading } = useRatesAvailabilityMetric();
      const { data: areaInfoData, isLoading: areaInfoLoading } = useAreaRatesAvailabilityInfo();

      // Combine all loading states into a single pageLoading variable
      const pageLoading = ratesAvailabilityMetricLoading || areaInfoLoading;
      if(pageLoading) return <LoadingSpinner/>;

      return (
		<section>
                  {/* Desktop View */}	
                  {isDesktop && 
                        <Suspense fallback={<LoadingSpinner/>}>
                              <div className="space-y-8 hidden md:block fade-in">
                                    {/* Summary Cards */}	
                                    <MetricCard />

                                    {/* Area Table Details */}	
                                    <div className="bg-white dark:bg-stone-900 p-3 rounded-lg shadow-lg border border-stone-200 dark:border-stone-700 relative">
                                          <TableTitle icon={<Calendar1Icon className="md:w-6 md:h-6 w-5 h-5 text-teal-500"/>} title={'Area Availability Data'}/>
                                          
                                          <RoomDetailsTable />
                                    </div>
                              </div>
                        </Suspense>
                  }
                  
                  {/* Mobile View */}	
                  {!isDesktop && 
                        <div className="block md:hidden">
                              {/* Summary Cards */}	
                              {selectedButton === 'Availability Overview' &&  
                                    <Suspense fallback={<LoadingSpinner/>}>
                                          <div className="fade-in">
                                                <MetricCard />
                                          </div>
                                    </Suspense>
                              }
      
                              {/* Area Table Details */}	
                              {selectedButton === 'Area Details' &&
                                    <Suspense fallback={<LoadingSpinner/>}>
                                          <div className="fade-in bg-white dark:bg-stone-900 p-2 rounded-lg shadow-sm border border-stone-200 dark:border-stone-700 relative">
                                                <TableTitle icon={<Calendar1Icon className="md:w-6 md:h-6 w-5 h-5 text-teal-500"/>} title={'Area Availability Data'}/>
                                                <RoomDetailsTable />
                                          </div>
                                    </Suspense>
                              }
                        </div>
                  }
                  
            </section>
      );
}
