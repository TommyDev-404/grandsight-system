import { useEffect, lazy, Suspense  } from "react";
import { useGlobalContext } from "../context/GlobalStorageContext";
import { useQueryClient } from "@tanstack/react-query";
import useDesktop from "../hooks/useDesktop";
import LoadingSpinner from '../shared/LoadingSpinner';
import { 
      staffQueries,
      useStaffsMetric,
      useStaffOnLeave
} from '../hooks/staffMgmtQueries';

const MetricCards = lazy(() => import("../components/StaffManagement/MetricCards"));
const StaffTable = lazy(() => import("../components/StaffManagement/StaffTable"));
const StaffAttendanceTable = lazy(() => import("../components/StaffManagement/StaffAttendanceTable"));


export default function StaffManagement(){
      const isDesktop = useDesktop();
      const { setButtons, selectedButton, setSelectedButton } = useGlobalContext();
      const queryClient = useQueryClient();

      useEffect(() =>  {
            setButtons(['Staffs Overview', 'Staffs Attendance']);
            setSelectedButton('Staffs Overview');
      }, []);

      useEffect(() => {
            async function prefetchStaff() {
                  try {
                        await Promise.all([
                              // Basic staff data
                              queryClient.prefetchQuery(
                                    staffQueries.metric()
                              ),
                              queryClient.prefetchQuery(
                                    staffQueries.onLeave()
                              ),
                              queryClient.prefetchQuery(
                                    staffQueries.staffList("")
                              )
                        ]);
                  } catch (error) {
                        console.error("Prefetch failed:", error);
                  }
            }
      
            prefetchStaff();
      }, []);
            
      const { data: metricData, isLoading: metricLoading } = useStaffsMetric();
      const { data: onLeaveData, isLoading: onLeaveLoading } = useStaffOnLeave();

      const pageLoading = metricLoading || onLeaveLoading ;

      if(pageLoading) return <LoadingSpinner/>;
      
      return (
            <section>
                  {/* Desktop View */}
                  {isDesktop && 
                        <Suspense fallback={<LoadingSpinner/>}>
                              <div className="hidden md:block space-y-8 fade-in">
                                    {/* Sunullmmary Cards */}
                                          <MetricCards />

                                    {/* Tables */}
                                    <div className="flex h-[calc(100vh-380px)] mt-8 gap-3">
                                          <StaffTable />
                                          <StaffAttendanceTable />
                                    </div>
                              </div>
                        </Suspense>
                  }

                  {/* Mobile View */}	
                  {!isDesktop && 
                        <div className="block md:hidden">
                              {/* Summary Cards */}	
                              {selectedButton === 'Staffs Overview' && 
                                    <Suspense fallback={<LoadingSpinner/>}>
                                          <div className="fade-in">
                                                      <MetricCards />
                                                      <StaffTable />
                                          </div>
                                    </Suspense>
                              }

                              {selectedButton === 'Staffs Attendance' && 
                                    <Suspense fallback={<LoadingSpinner/>}>
                                          <div className="fade-in">
                                                <StaffAttendanceTable />
                                          </div>
                                    </Suspense>
                              }
                        </div>      
                  }
                  
            </section>
      );
}