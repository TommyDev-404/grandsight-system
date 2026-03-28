import { Building2Icon } from "lucide-react";
import Button from "../../shared/Button";
import { useModal } from "../../context/ModalContext";
import { useAreaStatus } from "../../hooks/housekeepingQueries";

export default function AreaStatusTable(){
      const { openModal } = useModal();
      const { data: areaStatusData, isLoading } = useAreaStatus();
      const areaStatus = areaStatusData?.data || [];

      const handleViewRoomModal = (completeAreaName) => {
            openModal({ name: 'view rooms', areaSelected : completeAreaName });
      };
      
      return (
            <ul  className="fade-in grid grid-cols-1 md:grid-cols-4 gap-7 md:h-[calc(100vh-390px)] h-[calc(100vh-405px)] pb-4 py-3 px-0.5 md:px-3  overflow-y-auto scrollbar-hide dark:bg-stone-700">
                  {areaStatus.map(data => (
                        <li key={data.area_name}  className=" flex flex-col gap-6 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg p-4 shadow-md hover:shadow-lg hover:scale-103 transition-transform duration-200 ease-in-out">
                              <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{data.area_name}</h4>
                                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400">Total Area: {data.total_room}</span>
                              </div>

                              <div className="space-y-3">
                                    <div>
                                          <div className="flex justify-between mb-1">
                                          <span className="text-xs font-medium text-gray-700 dark:text-gray-200">To Be Cleaned</span>
                                          <span className="text-sm font-bold ${Number(need_clean) > 0 ? 'text-red-600' : 'text-blue-600'} dark:text-red-400">{data.need_clean}</span>
                                          </div>
                                          <div className="w-full bg-stone-200 dark:bg-stone-700 h-3 rounded-full overflow-hidden">
                                          <div className={`h-3 rounded-full bg-red-600`} style={{ width: `${(Number(data.need_clean) / Number(data.total_room)) * 100}%` }}></div>
                                          </div>
                                    </div>

                                    <div>
                                          <div className="flex justify-between mb-1">
                                          <span className="text-xs font-medium text-gray-700 dark:text-gray-200">Cleaning</span>
                                          <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{data.on_clean}</span>
                                          </div>
                                          <div className="w-full bg-stone-200 dark:bg-stone-700 h-3 rounded-full overflow-hidden">
                                          <div className={`h-3 rounded-full bg-yellow-600`} style={{ width: `${(Number(data.on_clean) / Number(data.total_room)) * 100}%` }}></div>
                                          </div>
                                    </div>

                                    <div>
                                          <div className="flex justify-between mb-1">
                                          <span className="text-xs font-medium text-gray-700 dark:text-gray-200">Ready</span>
                                          <span className="text-sm font-bold text-green-600 dark:text-green-400">{data.ready}</span>
                                          </div>
                                          <div className="w-full bg-stone-200 dark:bg-stone-700 h-3 rounded-full overflow-hidden">
                                          <div className={`h-3 rounded-full bg-green-600`} style={{ width: `${(Number(data.ready) / Number(data.total_room)) * 100}%` }}></div>
                                          </div>
                                    </div>
                              </div>

                              <Button icon={<Building2Icon className="w-4 h-4"/>} text={'View Rooms'} type={'button'} clickEvent={() => handleViewRoomModal(data.area_name)} className={'p-3'}/>
                        </li>
                  ))}
            </ul>
      );
}