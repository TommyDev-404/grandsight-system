import AboveIconMetricCard from "../../shared/AboveIconMetricCard";
import { BedDoubleIcon, BookmarkCheckIcon, BuildingIcon, Check } from "lucide-react";
import { useRatesAvailabilityMetric } from "../../hooks/ratesQueries";

export default function MetricCard(){
      const { data: areaMetric, isLoading } = useRatesAvailabilityMetric();

      return ( 
            <div className="grid grid-cols-1  md:grid-cols-4 gap-4 ">
                  <AboveIconMetricCard icon={<BuildingIcon className=" text-purple-500 dark:text-white w-5 h-5 md:w-6 md:h-6"/>} title={'Total Area'} data={areaMetric?.total_area} bgColor={'bg-purple-100 dark:bg-purple-500'}/>
                  <AboveIconMetricCard icon={<Check className="text-blue-500 dark:text-white w-5 h-5 md:w-6 md:h-6"/>} title={'Today`s Available'} data={areaMetric?.available} bgColor={'bg-blue-100 dark:bg-blue-500'}/>
                  <AboveIconMetricCard icon={<BedDoubleIcon className=" text-red-500 dark:text-white w-5 h-5 md:w-6 md:h-6"/>} title={'Total Occupied'} data={areaMetric?.occupied} bgColor={'bg-red-100 dark:bg-red-500'}/>
                  <AboveIconMetricCard icon={<BookmarkCheckIcon className="text-green-500 dark:text-white w-5 h-5 md:w-6 md:h-6"/>} title={'Overall Reserved Area'} data={areaMetric?.reserve} bgColor={`bg-green-100 dark:bg-green-500`}/>
            </div>
      );
}