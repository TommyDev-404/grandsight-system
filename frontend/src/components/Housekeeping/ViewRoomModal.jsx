import { useState } from "react";
import { ClipboardCheckIcon, Eye, Loader2Icon, UserPlus2Icon } from "lucide-react";
import { useMessageCard } from "../../context/MessageCardContext";
import { useAreaDetails, useMarkReady } from "../../hooks/housekeepingQueries";
import AreaIndividualCleaningHistory from "./AreaIndividualCleaningHistory";
import AssignCleanerModal from "./AssignCleanerModal";
import ModalWrapper from "../modals/ModalWrapper";

const completeStatusName = (status) => {
      if (status === 'avl') {
            return "Ready/Available";
      }else if (status === 'on-clean'){
            return "On-Cleaning";
      }else if (status === 'occupied'){
            return "Occupied";
      }else{
            return "Need-Clean";
      }
};

export default function ViewRoomsModal({ closeModal, areaName }){
      const { showMessage } = useMessageCard();
      const [ openAnotherModal, setOpenAnotherModal ] = useState({ open: null, payload: null});

      const { data: areaDetailsData, isLoading } = useAreaDetails(areaName);
      const areaDetails = areaDetailsData?.data || [];
      
      const { mutate: markReady, isPending } = useMarkReady({ showMessage });
      
      const handleOpenIndividualCleaning = (roomNo) => {
            setOpenAnotherModal({ name: 'individual cleaning', payload : { completeAreaName : areaName, roomNo:  roomNo} });
      };
      
      const handleAssignCleaner = (roomNo) => {
            setOpenAnotherModal({ name: 'assign cleaner', payload : { completeAreaName : areaName, roomNo:  roomNo} });
      };

      const handleMarkReady = async(roomNo) => {
            markReady({ room_no: roomNo, area_name: areaName });
      };
      
      return (
            <ModalWrapper modalTitle={`${areaName} - Area Details`} modalTitleDescription={'View all area with their current status.'} closeModal={closeModal} className={'md:w-[50%] overflow-hidden'}>
                  
                  {/* Desktop View */}
                  <div className="hidden md:block overflow-y-auto h-[40vh] scrollbar-hide">
                        <table className="min-w-full divide-y divide-gray-200 text-center">
                              <thead className="dark:bg-stone-500 bg-stone-900 text-white sticky top-0">
                                    <tr className="text-[12px] whitespace-nowrap md:text-sm">
                                          <th className="px-4 py-3 font-semibold uppercase">Area No.</th>
                                          <th className="px-4 py-3 font-semibold uppercase">Status</th>
                                          <th className="px-4 py-3  font-semibold uppercase">Action</th>
                                    </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200" >
                                    {areaDetails.map(data => (
                                          <tr key={data.room} className="bg-stone-50 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-800 dark:text-white">
                                                <td className="py-3 font-semibold text-xs md:text-[20px]">{data.room}</td>
                                                <td className="py-3 ">
                                                      <span className={`${completeStatusName(data.status) === 'Ready/Available' ? 'bg-green-500' : completeStatusName(data.status) === 'On-Cleaning' ? 'bg-yellow-500' : completeStatusName(data.status) === 'Need-Clean' ? 'bg-red-500' : 'bg-orange-500' } py-1  px-3 text-white rounded-full text-[12px] md:text-[15px]`}>{completeStatusName(data.status)}</span>
                                                </td>
                                                <td className="py-3 flex justify-center">
                                                      <button onClick={completeStatusName(data.status) === 'Ready/Available' || completeStatusName(data.status) === 'Occupied' ? () => handleOpenIndividualCleaning(data.room) : completeStatusName(data.status) === 'Need-Clean' ? () => handleAssignCleaner(data.room) : () => handleMarkReady(data.room) } className={` p-2 rounded-lg  ${completeStatusName(data.status) === 'Ready/Available' || completeStatusName(data.status) === 'Occupied' ? 'bg-purple-500 hover:bg-purple-600' : completeStatusName(data.status) === 'Need-Clean' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                                                            {completeStatusName(data.status) === 'Ready/Available' || completeStatusName(data.status) === 'Occupied' ?
                                                                  <Eye className="text-white md:w-5 md:h-5 w-4 h-4"/> 
                                                            : completeStatusName(data.status) === 'On-Cleaning' ?
                                                                  <>
                                                                        {isPending ? 
                                                                              <Loader2Icon className="w-5 h-5 text-white animate-spin"/>
                                                                        :
                                                                              <ClipboardCheckIcon className="text-white  md:w-5 md:h-5 w-4 h-4"/>
                                                                        }
                                                                  </>
                                                            :  
                                                                  <UserPlus2Icon className="text-white  md:w-5 md:h-5 w-4 h-4"/> 
                                                            }
                                                      </button>
                                                </td>
                                          </tr>
                                    ))}
                              </tbody>
                        </table>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden space-y-3 h-[calc(100vh-469px)] overflow-y-auto px-3 py-2  scrollbar-hide">
                        {areaDetails.map(staff => (
                              <div key={staff.room}  className={`p-4 rounded-lg border cursor-pointer transition  bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800`}>
                                    <div className="flex justify-between items-center">
                                          <p className="text-[17px] font-semibold text-gray-900 dark:text-gray-100">Area No. - {staff.room}</p>
                                          <button 
                                                onClick={
                                                      completeStatusName(staff.status) === 'Ready/Available' ?
                                                            () => handleOpenIndividualCleaning(staff.room) 
                                                      : completeStatusName(staff.status) === 'Need-Clean' ?
                                                            () => handleAssignCleaner(staff.room) 
                                                      : 
                                                            () => handleMarkReady(data.room)  
                                                      } 
                                                className={` p-2 rounded-lg  ${completeStatusName(staff.status) === 'Ready/Available' || completeStatusName(staff.status) === 'Occupied' ? 'bg-purple-500 hover:bg-purple-600' : completeStatusName(staff.status) === 'Need-Clean' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                                          >
                                                {completeStatusName(staff.status) === 'Ready/Available' || completeStatusName(staff.status) === 'Occupied' ?
                                                            <Eye className="text-white md:w-5 md:h-5 w-4 h-4"/> 
                                                      : completeStatusName(staff.status) === 'On-Cleaning' ?
                                                            <>
                                                                  {isPending ? 
                                                                        <Loader2Icon className="w-5 h-5 text-white animate-spin"/>
                                                                  :
                                                                        <ClipboardCheckIcon className="text-white  md:w-5 md:h-5 w-4 h-4"/>
                                                                  }
                                                            </>
                                                      :  
                                                            <UserPlus2Icon className="text-white  md:w-5 md:h-5 w-4 h-4"/> 
                                                }
                                          </button>
                                    </div>
                                    <div className="mt-2">
                                          <p className="text-xs text-gray-600 dark:text-gray-400 flex gap-1 items-center">Status: <span className={`${completeStatusName(staff.status) === 'Ready/Available' ? 'bg-green-500' : completeStatusName(staff.status) === 'On-Cleaning' ? 'bg-yellow-500' : 'bg-red-500' } py-1  px-3 text-white rounded-full text-[12px] md:text-[15px]`} >{completeStatusName(staff.status)}</span></p>
                                    </div>
                              </div>
                        ))}
                  </div>

                  {openAnotherModal.name === "individual cleaning" &&
                        <AreaIndividualCleaningHistory data={openAnotherModal.payload} setOpenAnotherModal={setOpenAnotherModal}/>
                  }
                  
                  {openAnotherModal.name === "assign cleaner" &&
                        <AssignCleanerModal data={openAnotherModal.payload} setOpenAnotherModal={setOpenAnotherModal}/>
                  }
                  
            </ModalWrapper>
      );
}