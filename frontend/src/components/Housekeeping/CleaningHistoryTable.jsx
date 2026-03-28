import { useCleaningHistory } from "../../hooks/housekeepingQueries";

const completeStatusName = (status) => {
      if (status === 'avl') {
            return "Ready/Available";
      }else if (status === 'on-clean'){
            return "On-Cleaning";
      }else{
            return "Need-Clean"
      }
};

export  default function CleaningHistoryTable({ month, day }){
      const { data: cleaningData, isLoading } = useCleaningHistory(month, day);
      const cleaningHistory = cleaningData?.data || [];

      return (
            <div className="">
                  {/* Desktop View */}
                  <div className="hidden md:block">
                        <div className="overflow-y-auto md:h-[calc(100vh-390px)]" >
                              <table className="min-w-full text-center">
                                    <thead className="bg-stone-800 dark:bg-stone-500 text-white sticky top-0 text-sm z-50">
                                          <tr className="text-xs md:text-[18px] whitespace-nowrap">
                                                <th className="px-6 py-3 uppercase">Room Name</th>
                                                <th className="px-6 py-3 uppercase">Assigned Staff</th>
                                                <th className="px-6 py-3 uppercase">Date Cleaned</th>
                                                <th className="px-6 py-3 uppercase">Status</th>
                                          </tr>
                                    </thead>
                                    <tbody className="max-h-[calc(100vh-550px)] pb-4 overflow-y-auto">
                                          {cleaningHistory.length > 0 ? 
                                                cleaningHistory.map(data => (
                                                      <tr key={data.id} className="text-sm whitespace-nowrap bg-stone-50 border-b border-stone-200 dark:border-stone-700 dark:hover:bg-stone-700 hover:bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-white" >
                                                            <td className="p-4 font-semibold uppercase ">{data.room}</td> 
                                                            <td  className="p-4">{data.name}</td>
                                                            <td  className="p-4">{new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric'})}</td>
                                                            <td className="p-4">
                                                                  <span className={`${completeStatusName(data.status) === 'Ready/Available' ? 'bg-green-500' : completeStatusName(data.status) === 'Cleaning' ? 'bg-yellow-500' : 'bg-red-500' } py-2 font-semibold px-3 text-white rounded-full text-[11px] md:text-sm`}>{completeStatusName(data.status)}</span>
                                                            </td>
                                                      </tr>
                                                ))
                                          :
                                                <tr  className="text-sm whitespace-nowrap bg-stone-50 border-b border-stone-200 dark:border-stone-700 dark:hover:bg-stone-700 hover:bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-white " >
                                                      <td colSpan={4} className="p-4 text-stone-700 dark:text-stone-200">No cleaning history in this date.</td> 
                                                </tr>
                                          }
                                    </tbody>
                              </table>
                        </div>
                  </div>

                  {/* Mobile View */}
                  <div className="md:hidden space-y-3 h-[calc(100vh-469px)] overflow-y-auto mt-12">
                        {cleaningHistory.length > 0 ? 
                              cleaningHistory.map(staff => (
                                    <div key={staff.id}  className={`p-4 rounded-lg border cursor-pointer transition  bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800`}>
                                          <div className="flex flex-col justify-between items-center">
                                                <p className="text-[17px] font-semibold text-gray-900 dark:text-gray-100">{staff.room}</p>
                                                <p className={`text-[12px] text-white py-1 px-2 rounded-full font-semibold ${completeStatusName(staff.status) === 'Ready/Available' ? 'bg-green-500' : completeStatusName(data.status) === 'Cleaning' ? 'bg-yellow-500' : 'bg-red-500'}`}>{completeStatusName(staff.status)}</p>
                                          </div>
                                          <div className="mt-4">
                                                <p className="text-xs text-gray-600 dark:text-gray-400 flex gap-1 items-center">Assigned to: <span className="font-semibold">{staff.name}</span></p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 flex gap-1 items-center">Date: <span className="font-semibold">{new Date(staff.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric'})}</span></p>
                                          </div>
                                    </div>
                              ))
                        :
                        <div  className="text-xs bg-stone-50 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center py-12" >
                              <p  className="p-4 text-stone-700 dark:text-stone-200">No cleaning history in this date.</p> 
                        </div>
                        }
                  </div>
            </div>
      );
}