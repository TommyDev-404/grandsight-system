import AboveIconMetricCard from "../../shared/AboveIconMetricCard";
import { BedDoubleIcon, BookmarkCheckIcon, BuildingIcon, Check } from "lucide-react";
import { useRatesAvailabilityMetric } from "../../hooks/ratesQueries";

export default function MetricCard(){
      const { data: areaMetric, isLoading } = useRatesAvailabilityMetric();

      return ( 
            <div className="grid grid-cols-1  md:grid-cols-4 gap-4 ">
                  <AboveIconMetricCard icon={<BuildingIcon className="text-white w-5 h-5 md:w-6 md:h-6"/>} title={'Total Area'} data={areaMetric?.total_area} />
                  <AboveIconMetricCard icon={<Check className="text-white w-5 h-5 md:w-6 md:h-6"/>} title={'Today`s Available'} data={areaMetric?.available} />
                  <AboveIconMetricCard icon={<BedDoubleIcon className="text-white w-5 h-5 md:w-6 md:h-6"/>} title={'Total Occupied'} data={areaMetric?.occupied} />
                  <AboveIconMetricCard icon={<BookmarkCheckIcon className="text-white w-5 h-5 md:w-6 md:h-6"/>} title={'Overall Reserved Area'} data={areaMetric?.reserve} />
            </div>
      );
}