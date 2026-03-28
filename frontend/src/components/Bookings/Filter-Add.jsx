import { useState, useEffect } from "react";
import { PlusCircleIcon } from "lucide-react";
import { useModal } from "../../context/ModalContext";

const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
];

export default function FilterAndAddBooking({ year, month, day, setYear, setMonth, setDay,  }){
      const { openModal } = useModal();
      const [daysInMonth, setDaysInMonth] = useState([]);
      const [ disableDay, setDisableDay ] = useState(true);

      const handleOpenModal = () => {
            openModal({ name: 'add booking' });
            
            const today = new Date();

            setYear(today.getFullYear());
            setMonth(today.getMonth() + 1); // JS months are 0-based
            setDay(today.getDate());

            setDisableDay(false); // make sure day is enabled
      };
      
      const toggleDay = () => {
            setDisableDay(prev => !prev);
      };

      // auto set day based on month
      useEffect(() => {
            if (!year || !month) return;

            // month-1 because JS Date month is 0-indexed
            const daysCount = new Date(year, month, 0).getDate(); // get the last date of the previous month
            const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1); // get the days in a month you selected

            setDaysInMonth(daysArray);
      }, [year, month]);

      // prevent react bug: rendering another component while the current is still rendering
      /* what happen?: you put the setDay on the same part where you toggle the enabling/disabling the day, which cause the component in the parent to rerender 
            and react does not allow it. It need to finish rendering the current before another.
      */
      useEffect(() => {
            if (disableDay && day !== null) setDay(null); // if you disable the day and there is a day, update the day state to null since day is disabled
            if (!disableDay && day === null) setDay(new Date().getDate()); // if not disabled, update the day state to the day you selected
      }, [disableDay]);
      

      return (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative mt-4">
                  <div className="flex justify-around items-center md:gap-4">
                        {/* Year Select */}
                        <div className="flex items-center gap-1 md:gap-2 relative">
                              <label  className="text-[12px] md:text-[15px] text-stone-700 dark:text-stone-100 absolute -top-4 left-1/2 -translate-x-1/2 md:relative md:top-0 md:left-0 md:translate-0">Year:</label>
                              <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="md:py-2.5 px-4 py-2 text-xs md:text-sm border border-stone-300 rounded-sm dark:bg-stone-800 bg-white  dark:text-stone-100 text-stone-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                    <option value={2025}>2025</option>
                                    <option value={2026}>2026</option>
                              </select>
                        </div>

                        {/* Month Select */}
                        <div className="flex items-center gap-1 md:gap-2 relative">
                              <label  className="text-[12px] md:text-[15px] text-stone-700 dark:text-stone-100 absolute -top-4 left-1/2 -translate-x-1/2 md:relative  md:top-0 md:left-0 md:translate-0">Month:</label>
                              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="md:py-2.5 py-2 px-4 text-xs md:text-sm border border-stone-300 rounded-sm dark:bg-stone-800 bg-white text-stone-700 dark:text-stone-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                    {months.map((m, index) => (
                                          <option key={m} value={index + 1}>{m}</option> // value = 1-12
                                    ))}
                              </select>
                        </div>

                        {/* Day Select */}
                        <div className="flex items-center gap-1 md:gap-2 relative">
                              <input type="checkbox" onChange={toggleDay} checked={disableDay ? false : true}  className="w-4 h-4 md:w-5 md:h-5 accent-blue-500"/>
                              <label  className="text-[12px] md:text-[15px] text-stone-700 dark:text-stone-100 absolute -top-4 left-1/2 -translate-x-1/2 md:relative  md:top-0 md:left-0 md:translate-0">Day:</label>

                              {/* Wrapper for select + strikethrough */}
                              <div className="relative w-10 md:w-15">
                                    <select disabled={disableDay} value={day ?? ''} onChange={(e) => setDay(Number(e.target.value))} className={`md:py-2.5 py-2 px-4 text-xs md:text-sm border ${disableDay ? 'border-red-200 text-stone-100' : 'border-stone-300 dark:bg-stone-800 bg-white dark:text-stone-100 text-stone-700'} rounded-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all h-auto w-full`}>
                                          {daysInMonth.map((d) => (
                                                <option key={d} value={d}>{d}</option>
                                          ))}
                                    </select>

                                    {/* Strikethrough line */}
                                    {disableDay && (
                                          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="w-full h-0.5 bg-red-500"></div>
                                          </span>
                                    )}
                              </div>
                  </div>
                  </div>

                  <button onClick={handleOpenModal} type="button" className="hidden md:flex items-center justify-center gap-2 bg-linear-to-r from-green-500 to-emerald-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-sm hover:shadow-lg active:scale-95  transition-all duration-300 cursor-pointer">
                        <PlusCircleIcon/>Add Booking
                  </button>
            </div>
      );
}
