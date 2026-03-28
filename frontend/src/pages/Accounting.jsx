import { useEffect, useState } from "react";
import { CreditCardIcon, DollarSignIcon, Globe2Icon } from "lucide-react";
import { useAccountingMetric, useRevenueData, accountingQueries } from "../hooks/accountingQueries";
import { useGlobalContext } from "../context/GlobalStorageContext";
import { useQueryClient } from "@tanstack/react-query";
import SideIconCards from '../shared/SideIconCards';
import BookingReportTable from "../components/Accounting/RevenueReportTable";
import FilterAndTitle from "../components/Accounting/FilterTitle";
import LoadingSpinner from '../shared/LoadingSpinner';


export default function Accounting(){
      const { setButtons, setSelectedButton } = useGlobalContext();
      const [ year, setYear ] = useState(new Date().getFullYear());
      const queryClient = useQueryClient();

      useEffect(() =>  {
            setButtons([]);
            setSelectedButton('')
      }, []);

      useEffect(() => {
            async function prefetchAccounting() {
                  try {
                        await Promise.all([
                              queryClient.prefetchQuery(accountingQueries.metric()),
                              queryClient.prefetchQuery(accountingQueries.revenueData()),
                        ]);
                  } catch (error) {
                        console.error("Prefetch failed:", error);
                  }
            }

            prefetchAccounting();
      }, []);
      
      const { data: accountingMetric, isLoading: accountingMetricLoading } = useAccountingMetric();
      const { data: revenueData, isLoading: accountingDataLoading } = useRevenueData(year);
      const accountingData = revenueData?.data || [];

      const pageLoading = accountingMetricLoading;

      if (pageLoading) return <LoadingSpinner/>;

      return (
		<section className="fade-in h-auto overflow-y-auto md:overflow-visible">
                  {/* Summary  Cards */}	
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                        <SideIconCards title={'Direct Payment (Today)'} icon={<CreditCardIcon className="w-5 h-5 text-blue-500 dark:text-white"/>} bgColor={'bg-blue-100 dark:bg-blue-500'} data={new Intl.NumberFormat("en-PH", { style: 'currency', currency: "PHP" }).format(accountingMetric?.direct)}/>
                        <SideIconCards title={'ZUZU Payment (Today)'} icon={<Globe2Icon className="w-5 h-5 text-yellow-500 dark:text-white"/>} bgColor={'bg-yellow-100 dark:bg-yellow-500'} data={new Intl.NumberFormat("en-PH", { style: 'currency', currency: "PHP" }).format(accountingMetric?.online)}/>
                        <SideIconCards title={'Total Revenue'} icon={<DollarSignIcon className="w-5 h-5 text-green-500 dark:text-white"/>} bgColor={'bg-green-100 dark:bg-green-500'} data={new Intl.NumberFormat("en-PH", { style: 'currency', currency: "PHP" }).format(accountingMetric?.total_revenue)}/>
                  </div>
                  
                  {/* Booking Revenue Report Table */}	
                  <div className="bg-white dark:bg-stone-900 md:p-4 p-2 rounded-lg shadow-lg border border-stone-200 dark:border-stone-700 relative mt-6 md:mt-10 h-[calc(100vh-300px)] md:h-[calc(100vh-270px)]">
                        <FilterAndTitle setYear={setYear} year={year} />
                        <BookingReportTable revenueData={accountingData} isLoading={accountingDataLoading}/>
                  </div>
            </section>
      );
}
