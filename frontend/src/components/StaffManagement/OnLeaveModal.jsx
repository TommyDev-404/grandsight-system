import ModalWrapper from "../modals/ModalWrapper";
import { useStaffOnLeave } from "../../hooks/staffMgmtQueries";

export default function OnLeaveModal({ closeModal }){
      const { data: onLeaveData, isLoading } = useStaffOnLeave();
      const onLeave = onLeaveData?.data ?? [];

      return (
            <ModalWrapper modalTitle={'Staff On Leave - History'} modalTitleDescription={'List of all staff that is currently on leave.'} closeModal={closeModal} className={' md:w-[50%]'}>
                  {/* Desktop View */}
                  <div className="hidden md:block overflow-y-auto h-60 ">
                        <table className="w-full text-sm border-collapse">
                              <thead className="bg-stone-800 dark:bg-stone-600 text-white sticky top-0">
                                    <tr className="text-center">
                                          <th className="p-2 ">Staff Name</th>
                                          <th className="p-2 ">Position</th>
                                          <th className="p-2 ">Date</th>
                                    </tr>
                              </thead>
                              <tbody  className="text-gray-700 dark:text-gray-300">
                                    {onLeave.length > 0 ? 
                                          onLeave.map((staff) => (
                                                <tr key={staff.id} className="border-b border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800">
                                                      <td className="p-2 text-center">{staff.name}</td>
                                                      <td className="p-2 text-center">{staff.position}</td>
                                                      <td className="p-2 text-center">{staff.date}</td>
                                                </tr>
                                          ))
                                    :
                                          <tr  className="border-b border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800">
                                                <td colSpan={3} className="p-2 text-center text-stone-700 dark:text-stone-200">No staff on leave.</td>
                                          </tr>
                                    }
                              </tbody>
                        </table>
                  </div>
                  
                  {/* Mobile View */}
                  <div className="md:hidden space-y-3 max-h-70 overflow-y-auto p-3">
                        {onLeave.length > 0 ? 
                              onLeave.map((staff) => (
                                    <div key={staff.id}  className={`p-4 rounded-lg border cursor-pointer transition  bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800`}>
                                          <div>
                                                <p className="font-semibold text-gray-900 dark:text-gray-100">{staff.name}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 flex gap-1 items-center">Position: <span className="font-semibold">{staff.position}</span></p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 flex gap-1 items-center">Date Leave: <span className="font-semibold">{staff.date}</span></p>
                                          </div>
                                    </div>
                              ))
                        :
                              <div  className={`h-20 flex justify-center items-center rounded-lg border cursor-pointer transition  bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800`}>
                                    <p className="text-xs text-gray-700 dark:text-gray-400 flex gap-1 items-center">No staff on leave.</p>
                              </div>
                        }
                  </div>
            </ModalWrapper>
      );
}