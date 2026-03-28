import { useEffect, useState } from "react";
import { useModal } from "../../context/ModalContext";
import { useTheme } from "../../context/ThemeContext";
import StaffListCard from "./StaffLIstData";

export default function StaffTable(){
      const { openModal } = useModal();
      const [ staffName, setStaffName ] = useState('');

      const handleOpenModal = () => {
            openModal({ name : 'add staff' });
      };

      return(
            <div className="md:w-1/3 w-full md:h-[calc(100vh-300px)] h-[calc(100vh-200px)] mt-6 border border-stone-300 dark:border-stone-700 dark:bg-stone-900 bg-white flex flex-col rounded-lg md:mt-0">
                  <div className="flex justify-between items-center p-2 md:p-4 border-b border-stone-300 dark:border-stone-800">
                        <h2 className="text-[18px] md:text-lg font-semibold text-gray-900 dark:text-gray-100">Staff Details</h2>
                        <button onClick={handleOpenModal}  className={`bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs md:text-sm`}>+ Add</button>
                  </div>
                  <div className="p-2 md:p-3">
                        <input type="text" name="search-staff" value={staffName} onChange={(e) => setStaffName(e.target.value)} placeholder="Search staff..." className="text-sm md:text-base w-full p-2 text-stone-900 dark:text-stone-100 rounded-lg border border-stone-300 dark:border-stone-700 dark:bg-stone-800 outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>

                  <StaffListCard name={staffName}/>
            </div>
      );
}