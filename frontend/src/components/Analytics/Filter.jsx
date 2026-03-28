import { ArrowDownIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetAllResortArea } from "../../hooks/analyticsQueries";

export default function Filter({ area, setArea }){
      const queryClient = useQueryClient(); // ✅ This gives you the client instance

      const { data: allAreaData, isLoading } = useGetAllResortArea();
      const allArea = allAreaData?.data || [];

      const handleChangeArea = (area) => {
            setArea(area);

            queryClient.invalidateQueries(["analyticsStatistics"]);
            queryClient.invalidateQueries(["forecastCheckinRevenue"]);
      };
      
      return (
            <div className="flex gap-2 items-center">
                  <label className="text-stone-800 dark:text-white text-xs md:text-sm font-semibold">Filter by:</label>
                  <div className="flex justify-between items-center relative">
                        <select value={area} onChange={(e) => handleChangeArea(e.target.value)}  className="text-sm block w-full appearance-none bg-white dark:bg-stone-900 border border-stone-300 text-stone-700 dark:text-stone-100 py-2 px-4 pr-10 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200 hover:border-stone-400 cursor-pointer">
                              <option value="All Resort Areas">All Resort Areas</option>
                              {allArea.map(area => (
                                    <option key={area.area_name} value={area.area_name}>{area.area_name}</option>
                              ))}
                        </select>

                        <div className="absolute right-2 pointer-events-none">
                              <ArrowDownIcon className="w-4 h-4 text-stone-800 dark:text-white"/>
                        </div>
                  </div>
            </div>
            
      );
}