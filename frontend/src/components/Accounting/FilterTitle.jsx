import { BarChart2Icon } from "lucide-react";
import TableTitle from "../../shared/TableTitle";

export default function FilterAndTitle({ year, setYear }){
      const handleSetYear = (year) => {
            setYear(year);
      };

      return (
            <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-700 pb-2">
                  <TableTitle icon={<BarChart2Icon className="md:w-6 md:h-6 w-4 h-4 text-green-500"/>} title={'Booking Revenue Report'} showBorderBottom={false}/>
                  
                  <select value={year} onChange={(e) => handleSetYear(e.target.value)}  className="md:py-2.5 md:px-6 py-2 px-2 text-xs md:text-sm border border-stone-300 rounded-sm dark:bg-stone-800 bg-stone-50 dark:text-stone-100 text-stone-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                        <option value={2025}>{2025}</option>
                        <option value={2026}>{2026}</option>
                  </select>
            </div>
      )
}