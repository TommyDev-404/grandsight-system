import { useEffect, useState } from 'react';
import { PiBroomFill } from "react-icons/pi";
import { useGlobalContext } from "../context/GlobalStorageContext";
import { useQueryClient } from '@tanstack/react-query';
import AboveIconMetricCard from "../shared/AboveIconMetricCard";
import TableTitle from "../shared/TableTitle";
import LoadingSpinner from '../shared/LoadingSpinner';
import AreaStatusTable from '../components/Housekeeping/AreaStatusTable';
import CleaningHistoryTable from '../components/Housekeeping/CleaningHistoryTable';
import { 
      AreaChartIcon, 
      ArrowRightIcon, 
      ArrowLeftIcon, 
      BubblesIcon, 
      CheckIcon, 
      Loader 
} from "lucide-react";
import { 
      useHousekeepingMetric,  
      useAreaStatus,
      housekeepingQueries,
      useCleaningHistory
} from "../hooks/housekeepingQueries";

const months = [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December"
];

export default function Housekeeping(){
      const { setButtons, setSelectedButton } = useGlobalContext();
      const [ tableState, setTableState ] = useState('Room Status');
      const today = new Date();
      const [year] = useState(today.getFullYear());
      const [month, setMonth] = useState(today.getMonth() + 1); // 1–12
      const [day, setDay] = useState(today.getDate());
      const [daysInMonth, setDaysInMonth] = useState([]);
      const queryClient = useQueryClient();

      const { data: metricData, isLoading } = useHousekeepingMetric();

      const handleChangingTableState = (currentState) => {
            setTableState(currentState === 'Room Status' ? 'Cleaning History' : 'Room Status');
      };
      
      useEffect(() =>  {
            setButtons([]);
            setSelectedButton('')
      }, []);

      // auto set day based on month
      useEffect(() => {
            if (!year || !month) return;

            // month-1 because JS Date month is 0-indexed
            const daysCount = new Date(year, month, 0).getDate(); // get the last date of the previous month
            const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1); // get the days in a month you selected

            setDaysInMonth(daysArray);
      }, [year, month]);

      useEffect(() => {
            async function prefetchDashboard() {
                  try {
                        await Promise.all([
                              queryClient.prefetchQuery(housekeepingQueries.metric()),
                              queryClient.prefetchQuery(housekeepingQueries.areaStatus()),
                              queryClient.prefetchQuery(housekeepingQueries.cleaningHistory(month, day)),
                        ]);
                  } catch (error) {
                        console.error("Prefetch failed:", error);
                  }
            }

            prefetchDashboard();
      }, []);
      
      const { data: housekeepingMetricData, isLoading: housekeepingMetricLoading } = useHousekeepingMetric();
      const { data: areaStatusData, isLoading: areaStatusLoading } = useAreaStatus();
      const { data: cleaningHistoryData, isLoading: cleaningHistoryDataLoading } = useCleaningHistory(month, day);

      // Combine all loading states into a single pageLoading variable
      const pageLoading = housekeepingMetricLoading || areaStatusLoading || cleaningHistoryDataLoading;
      
      if(pageLoading) return <LoadingSpinner/>;

      return (
		<section className='fade-in'>
                  {/* Desktop And Mobile Overview */}	
                  {/* Summary Cards */}	
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <AboveIconMetricCard icon={<BubblesIcon className="text-blue-500 dark:text-white w-5 h-5 md:w-6 md:h-6"/>} title={'To Be Cleaned'} data={metricData?.need_clean} bgColor={'bg-blue-100 dark:bg-blue-500'}/>
                        <AboveIconMetricCard icon={<Loader className="animate-spin text-yellow-500 dark:text-white w-5 h-5 md:w-6 md:h-6"/>} title={'Cleaning'} data={metricData?.on_clean} bgColor={'bg-yellow-100 dark:bg-yellow-500'}/>
                        <AboveIconMetricCard icon={<CheckIcon className="text-green-500 dark:text-white w-5 h-5 md:w-6 md:h-6"/>} title={'Ready/Available'} data={metricData?.ready} bgColor={`bg-green-100 dark:bg-green-500`}/>
                  </div>
                  
                  <div className="bg-white mt-6 dark:bg-stone-900 md:p-3 p-2 rounded-md shadow-lg border border-stone-200 dark:border-stone-700 relative">
                        <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-700 pb-2">
                              {/* Table Title */}	
                              {tableState === 'Room Status' ? 
                                    <TableTitle icon={<AreaChartIcon className="md:w-6 md:h-6 w-5 h-5 text-blue-600"/>} title={'Resort Area`s Status'} showBorderBottom={false}/>
                              :  
                                    <TableTitle icon={<PiBroomFill className="md:w-6 md:h-6 w-5 h-5 text-green-600"/>} title={'Cleaning History'} showBorderBottom={false}/>
                              }

                              {/* Cleaning History Data */}	
                              {tableState === 'Cleaning History' && 
                                    <div className="fade-in md:gap-8 gap-4 absolute left-1/2 -translate-x-1/2 md:top-5 top-14 flex">
                                          <div className="flex items-center gap-1 md:gap-2">
                                                <label  className="text-[12px] md:text-[15px]  text-stone-900 dark:text-stone-100">Month:</label>
                                                <select value={month} onChange={(e) => setMonth(e.target.value)}  className="py-2 px-4 border border-stone-300 rounded-sm dark:bg-stone-800 bg-stone-50 text-stone-700 dark:text-gray-100 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                                      {months.map((m, i) => (
                                                            <option key={i} value={i + 1}>{m}</option>
                                                      ))}
                                                </select>
                                          </div>
                                          <div className="flex items-center gap-1 md:gap-2 relative overflow-visible">
                                                <label  className="text-[12px] md:text-[15px] font-normal text-gray-700 dark:text-gray-100">Day:</label>
                                                <select value={day} onChange={(e) => setDay(e.target.value)}  className="py-2 px-4 border border-stone-300 rounded-sm dark:bg-stone-800 bg-stone-50 dark:text-stone-100 text-stone-700 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"> 
                                                      {daysInMonth.map((d) => (
                                                            <option key={d} value={d}>{d}</option>
                                                      ))}
                                                </select>
                                          </div>
                                    </div>
                              }

                              {/* Table Button */}	
                              <button onClick={() => handleChangingTableState(tableState)} className={` p-2 md:px-4 md:py-3 ${tableState === 'Room Status' ? 'bg-green-600 hover:bg-green-700' :  'bg-indigo-500 hover:bg-indigo-600'}  text-white rounded-lg text-sm font-semibold transition flex gap-2 items-center`}>
                                    {tableState === 'Room Status' ? 
                                          <>
                                                <span className="hidden md:block">Switch to Cleaning History</span>
                                                <PiBroomFill className="md:w-5 md:h-5 w-4 h-4 text-white block md:hidden"/>
                                                <ArrowRightIcon className="w-3 h-3 md:w-4 md:h-4"/>
                                          </> :
                                          <>
                                                <AreaChartIcon className="md:w-5 md:h-5 w-4 h-4 text-white block md:hidden"/>
                                                <ArrowLeftIcon className="md:w-4 md:h-4 w-3 h-3"/>
                                                <span  className="hidden md:block">Switch to Room  Status</span>
                                          </>
                                    }
                              </button>
                        </div>
                        
                        {/* Table Info */}
                        {tableState === 'Room Status' ? 
                              <AreaStatusTable /> 
                        : 
                              <CleaningHistoryTable month={month} day={day}/>
                        }
                  </div>
            </section>
      );
}