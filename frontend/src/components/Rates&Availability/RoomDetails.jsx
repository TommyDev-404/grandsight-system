import {  LayoutDashboardIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useModal } from "../../context/ModalContext";
import { useMessageCard } from "../../context/MessageCardContext";
import { useAreaRatesAvailabilityInfo, useRemoveArea } from "../../hooks/ratesQueries";
import Button from "../../shared/Button";

export default function RoomDetailsTable(){
      const { openModal } = useModal();
      const { showMessage } = useMessageCard();

      const { data: areaDetailsData, isLoading } = useAreaRatesAvailabilityInfo();
      const areaDetails = areaDetailsData?.area || [];

      const { mutate: removeArea, isPending } = useRemoveArea({ showMessage });

      const handleOpenModal = (modalName, payload) => {
            if (payload?.promo !== 'None' && modalName !== 'add area'){
                  return showMessage({ status: 'failed', message: 'Cannot update! Area in under promo.'});
            }

            openModal({ 
                  name : modalName,
                  payload: payload
            });
      };

      const handleConfirmRemove = (areaName) => {
            openModal({ 
                  name: 'confirm remove area', 
                  payload: {
                        message: 'Are you sure you want to remove this area?',
                        buttonNameIdle: 'Remove',
                        buttonNameLoading: 'Removing...',
                        areaToRemove: areaName,
                        clickEvent: removeArea
                  }
            })
      };


      return (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 -mt-2 md:h-[calc(100vh-385px)] h-[calc(100vh-240px)] overflow-y-auto scrollbar-hide md:px-2 pb-4">
                  {areaDetails.map(data => (
                        <li  key={data.area_name} className=" bg-stone-50 dark:bg-white/5 shadow-sm border border-stone-200 dark:border-stone-700 rounded-md p-3 md:p-5 flex flex-col justify-between hover:shadow-lg hover:scale-[1.02] transition-transform duration-200">
                              <div className="flex flex-col ">
                                    <div className="flex flex-col gap-1">
                                          {data.promo !== "None"  && <span className="text-[12px] font-medium text-center  text-yellow-600 dark:text-yellow-500 bg-yellow-100 dark:bg-yellow-800 px-3 py-1.5 rounded-full ">{data.promo}</span>}
                                          <div className="flex items-center justify-between">
                                                <h4 className="text-[18px] md:text-lg font-semibold text-gray-800 dark:text-gray-100" >{data.area_name}</h4>
                                                <span className="text-xs md:text-sm font-normal text-gray-600 dark:text-gray-300">Capacity: {data.capacity}</span>
                                          </div>
                                    </div>

                                    <span className="text-[12px] md:text-xs text-stone-500 dark:text-stone-300">Category: {data.category}</span>
                              </div>
                        
                              { data.promo !== "None"
                                    ? <div className="flex flex-col items-start mt-3 mb-3">
                                          <span className="line-through text-red-500 font-light text-sm">{new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(data.orig_rate)}</span>
                                          <span className="text-green-600 dark:text-green-500 font-semibold text-xl">{new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(data.rate)}</span>
                                          <span className="text-xs text-gray-500 dark:text-gray-400">Promo Applied</span>
                                    </div>
                                    : <span className="text-green-600 dark:text-green-500 font-semibold text-lg md:text-xl mt-3 mb-3">{new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(data.rate)}</span>
                              }
                        
                              <div className="grid grid-cols-4 gap-1 text-center mb-3">
                                    <div>
                                          <span className="block text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Total Area</span>
                                          <span className="block font-bold text-lg text-gray-800 dark:text-gray-200">{data.total_rooms}</span>
                                    </div>
                                    <div>
                                          <span className="block text-xs text-gray-500 dark:text-gray-400">Available</span>
                                          <span className="block font-bold text-lg text-blue-500">{data.available}</span>
                                    </div>
                                    <div>
                                          <span className="block text-xs text-gray-500 dark:text-gray-400">Occupied</span>
                                          <span className="block font-bold text-lg text-red-500">{data.occupied}</span>
                                    </div>
                                    <div>
                                          <span className="block text-xs text-gray-500 dark:text-gray-400">Reserved</span>
                                          <span className="block font-bold text-lg text-green-500">{data.reserve}</span>
                                    </div>
                              </div>
                              
                              <div className="flex flex-col gap-2">
                                    <Button icon={<LayoutDashboardIcon className="w-4 h-4"/>} text={'Edit Area Details'} type={'button'} clickEvent={() => handleOpenModal('edit area', data)} className={'p-2.5 md:p-3 text-xs md:text-sm'}/>
                                    <button onClick={() => handleConfirmRemove(data.area_name)} className="bg-red-500 hover:bg-red-600 text-white p-1.5 md:p-2.5 text-xs md:text-sm rounded-md flex items-center justify-center gap-2" >
                                          <Trash2Icon className="w-4"/>
                                          Remove Area
                                    </button>
                              </div>
                        </li>
                  ))}
                  <li onClick={() => handleOpenModal('add area')} className="w-full min-h-75 max-h-90 bg-stone-100 dark:bg-stone-700 rounded-lg flex justify-center items-center border border-stone-200 dark:border-stone-600 hover:scale-103 transition-transform duration-200">
                        <PlusIcon className="text-stone-300 dark:text-stone-500 md:w-15 md:h-15"/>
                  </li>
            </ul>
      );
}