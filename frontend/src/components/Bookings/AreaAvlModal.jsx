import { CheckCircle, Users2 } from "lucide-react";
import ModalWrapper from "../modals/ModalWrapper";
import Button from "../../shared/Button";
import { useEffect, useState } from "react";
import { PiDownloadBold } from "react-icons/pi";
import { useAreaAvailable } from "../../hooks/bookingQueries";


export default function AreaAvlModal({ title, setModalOpen, setAccomodationSelected, accomodationSelected }){
      const { data, isLoading } = useAreaAvailable(title);
      const area = data?.rooms || [];

      const [ areaSelected, setAreaSelected ] = useState(accomodationSelected);
      
      const handleCloseModal = () => {
            setModalOpen(false);
      };    
      
      // Initialize modal selection or mark check the area you selected previously
      useEffect(() => {
            // filter mean get the all the data/area where it statisfy the condition 
            const selected = accomodationSelected.filter(item => item.startsWith(title)); // this means get all the area from accomodationSelected which have the same as the title
            setAreaSelected(selected);
      }, [accomodationSelected, title]);

      const handleSaveModal = () => {
            setAccomodationSelected(prev => [...prev, ...areaSelected]); // take the previous accomodationSelected and merge it with the current to save the current selected
            setModalOpen(false);

      };

      const handleToggleArea = (id) => {
            setAreaSelected(prev => prev.includes(id) ? prev.filter(staffId => staffId !== id) : [...prev, id]);
      };

      const toggleSelectAll = () => {
            if (areaSelected.length === area.length){
                  setAreaSelected([]);
            }else{
                  setAreaSelected(area.map(area => `${area.name} ${area.room}`));
            }
      };
      
      return (
            <ModalWrapper modalTitle={title} modalTitleDescription={`Choose at your choice and affordable areas below.`} closeModal={handleCloseModal} className={'h-auto md:w-[50%] md:h-auto'}>
                        <div className="flex flex-col gap-3 p-2 md:px-4 md:py-2">
                              <div className="flex justify-between">
                                    <p className="flex items-center text-stone-600 gap-1 dark:text-stone-200 text-sm md:text-[18px]">
                                          <Users2 className="w-4 md:w-5"/>
                                          Max capacity: 
                                    </p>
                                    <p className="font-semibold text-sm md:text-lg text-stone-800 dark:text-white">{area[0]?.capacity}</p>
                              </div>
                              <div className="p-2 scrollbar-hide bg-stone-100 dark:bg-stone-700 h-60 overflow-y-auto w-full border border-stone-200 dark:border-stone-700 rounded-sm flex flex-col gap-3">
                                    {area.map(area => (
                                          <button key={`${area.name} ${area.room}`} onClick={() => handleToggleArea(`${area.name} ${area.room}`)} className={`${areaSelected.includes(`${area.name} ${area.room}`) ? `bg-green-400  text-white ` : 'bg-stone-200 border-stone-300'} text-sm w-full p-4 rounded-lg border flex gap-2 justify-center items-center transform transition-all duration-200 ease-in-out`}>
                                                {areaSelected.includes(`${area.name} ${area.room}`) && <CheckCircle className="w-4"/>}
                                                {`${area.name} ${area.room}`}
                                          </button>
                                    ))}
                              </div>

                              <div className="flex flex-col gap-2">
                                    <label  className="flex items-center gap-1 text-xs md:text-sm md:text-[18px] text-stone-800 dark:text-stone-200">
                                          <input type="checkbox" onChange={toggleSelectAll} checked={areaSelected.length === area.length} className="w-3 md:w-4 h-4" /> Select all
                                    </label>

                                    <Button icon={<PiDownloadBold className="w-4 h-4"/>} text={'Save'} type={'submit'} clickEvent={handleSaveModal} className={'p-2.5 md:p-3 text-xs md:text-sm '} />
                              </div>
                        </div>
                        
            </ModalWrapper>
      );
}