import {  Grid2X2Check, BedDouble,  BookMarkedIcon, SprayCanIcon, Building2Icon, CheckCheck } from "lucide-react";
import { lazy, Suspense } from "react";
import { areaConfig } from "../Bookings/AddBookingModal";
import { useRoomOverviewAreas, useRoomOverviewMetric } from "../../hooks/dashboardQueries";
import { useTheme } from "../../context/ThemeContext";

const SideIconCards = lazy(() => import("../../shared/SideIconCards"));
const AreaCard = lazy(() => import("./AreaCard"));

export default function RoomOverview(){
      const { theme } = useTheme();
      const { data: areaMetric, isLoading: areaMetricLoading } = useRoomOverviewMetric();
      const { data: areaDetailsData, isLoading: areaDetailsLoading } = useRoomOverviewAreas();
      const areaDetails = areaDetailsData?.area || [];
      
      return (
            <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-3  pb-1 md:border-b border-stone-200  dark:border-stone-700">
                        <Building2Icon className={`w-4 h-4 md:w-6 md:h-6 ${theme.baseText}`}/>
                        <h2 className="text-sm md:text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">Resort Area Overview</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
                        <Suspense fallback={null}>
                              <SideIconCards title={'Total Area'} icon={<Grid2X2Check className="w-5 h-5 "/>}  data={areaMetric?.total_area}/>
                              <SideIconCards title={'Available'} icon={<CheckCheck className="w-5 h-5"/>} data={areaMetric?.available}/>
                              <SideIconCards title={'Total Occupied'} icon={<BedDouble className="w-5 h-5"/>} data={areaMetric?.occupied}/>
                              <SideIconCards title={'To be Cleaned'} icon={<SprayCanIcon className="w-5 h-5"/>} data={areaMetric?.today_need_clean}/>
                              <SideIconCards title={'Reserved Area'} icon={<BookMarkedIcon className="w-5 h-5"/>} data={areaMetric?.reserve}/>
                        </Suspense>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4 overflow-y-auto h-[65vh] md:h-[60vh] scrollbar-hide">
                        <Suspense fallback={null}>
                              { areaDetails.map(data => (
                                    <AreaCard key={data.area_name} roomName={data.area_name} icon={areaConfig[data.category.trim()].icon} occupied={data.occupied} reserved={data.reserve} needClean={data.need_clean} available={data.available} total={data.total_rooms}/>
                              ))}
                        </Suspense>
                  </div>
            </div>
      
      );    
}

/* 

      // get the metric cards details
      const totalArea = areaDetails.reduce((sum, area) => sum + area.total_rooms, 0);
      const totalOccupied = areaDetails.reduce((sum, area) => sum + Number(area.occupied), 0);
      const totalReserved = areaDetails.reduce((sum, area) => sum + Number(area.reserve), 0);
      const totalToBeCleaned = areaDetails.reduce((sum, area) => sum + Number(area.need_clean), 0);

*/