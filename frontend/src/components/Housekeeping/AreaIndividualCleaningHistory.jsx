import ModalWrapper from "../modals/ModalWrapper";
import { useAreaIndividualCleaning } from "../../hooks/housekeepingQueries";


export default function AreaIndividualCleaningHistory({ data, setOpenAnotherModal }){
      const roomNo = data.roomNo;
      const completeAreaName = data.completeAreaName + " " + roomNo;
      
      const { data: areaCleaningData, isLoading } = useAreaIndividualCleaning(completeAreaName);
      const areaDetails = areaCleaningData?.data || [];

      const handleCloseModal = () => {
            setOpenAnotherModal({ name : null, payload : null} );
      };

      return (
            <ModalWrapper modalTitle={`${completeAreaName}`} modalTitleDescription={`View all ${completeAreaName} cleaning history.`} closeModal={handleCloseModal} className={'md:w-[80%]'}>

                  {/* Desktop View */}
                  <div className="hidden md:block overflow-y-auto min-h-[15vh] max-h-[30vh] scrollbar-hide">
                        <table className="min-w-full divide-y divide-gray-200 text-center">
                              <thead className="dark:bg-stone-500 bg-stone-900 text-white sticky top-0">
                                    <tr className="text-[12px] whitespace-nowrap md:text-sm">
                                          <th className="px-4 py-3 font-semibold uppercase">Staff Name</th>
                                          <th className="px-4 py-3  font-semibold uppercase">Date Assigned</th>
                                    </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200" >
                                    {areaDetails.length > 0 ? 
                                          areaDetails.map(data => (
                                                <tr key={data.name} className="bg-stone-50 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 text-xs md:text-[18px] text-stone-800 dark:text-white">
                                                      <td className="py-3 font-bold">{data.name}</td>
                                                      <td className="py-3">{new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric'})}</td>
                                                </tr>
                                          ))
                                    :
                                          <tr  className="bg-stone-50 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 text-xs md:text-[18px] text-stone-800 dark:text-white">
                                                <td  colSpan={2} className="py-3 text-stone-700 dark:text-stone-300">No data.</td>
                                          </tr>
                                    }
                              </tbody>
                        </table>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden space-y-3 max-h-[calc(100vh-469px)] overflow-y-auto px-3 py-2">
                        {areaDetails.length > 0 ? 
                              areaDetails.map(staff => (
                                    <div key={staff.name}  className={`p-4 rounded-lg border cursor-pointer transition  bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800`}>
                                          <div className="flex justify-between items-center">
                                                <p className="text-[17px] font-semibold text-gray-900 dark:text-gray-100">{staff.name}</p>
                                          </div>
                                          <div className="mt-2">
                                                <p className="text-xs text-gray-600 dark:text-gray-400 flex gap-1 items-center">Date Assigned: <span className="font-semibold text-stone-800 dark:text-white">{staff.date}</span></p>
                                          </div>
                                    </div>
                              ))
                        :
                        <div   className={`h-30 flex justify-center items-center rounded-lg border cursor-pointer transition  bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800`}>
                              <p className="text-stone-700 dark:text-stone-300 text-xs md:text-sm">No data.</p>
                        </div>
                        }
                  </div>
            </ModalWrapper>
      );
}