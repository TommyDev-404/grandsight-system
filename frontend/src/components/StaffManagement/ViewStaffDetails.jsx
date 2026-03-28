import userImg from '../../assets/user.webp';
import { useStaffAttendanceHistory } from "../../hooks/staffMgmtQueries";
import ModalWrapper from "../modals/ModalWrapper";

export default function ViewStaffDetails({ closeModal, staff }){
      const { data: attendanceHistory, isLoading } = useStaffAttendanceHistory();

      return (
            <ModalWrapper 
                  modalTitle={staff?.staff_name} 
                  modalTitleDescription={
                        <div>
                              <label className="text-xs md:text-sm text-stone-500 dark:text-stone-400">Started on {new Date(staff?.date_started).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric'})}</label>
                              <p  className="text-stone-600 dark:text-stone-400 text-xs md:text-sm">{staff?.job_position}</p>
                        </div>
                  }
                  icon={
                        <img src={userImg} alt="Staff Image"  className="md:w-16 md:h-16 w-11 h-11 rounded-full"/>
                  }
                  closeModal={closeModal}
                  className={'md:w-[60%]'}
            >
                  <div className=" h-100 md:h-auto overflow-y-auto p-4 scrollbar-hide">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-700 text-center shadow-sm">
                                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Daily Salary</h3>
                                    <p  className="text-xl font-semibold text-gray-800 dark:text-white">{new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(staff?.daily_salary)}</p>
                              </div>

                              <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-700 text-center shadow-sm">
                                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Estimated Weekly</h3>
                                    <p  className="text-xl font-semibold text-gray-800 dark:text-white">{new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(staff?.estimate_weekly)}</p>
                              </div>

                              <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-700 text-center shadow-sm">
                                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Estimated Monthly</h3>
                                    <p  className="text-xl font-semibold text-gray-800 dark:text-white">{new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(staff?.estimate_month)}</p>
                              </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/40 text-center shadow-sm">
                                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Actual Weekly</h3>
                                    <p  className="text-xl font-semibold text-green-700 dark:text-green-300">{new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(staff?.weekly_salary)}</p>
                              </div>
                              
                              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/40 text-center shadow-sm">
                                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Actual Monthly</h3>
                                    <p  className="text-xl font-semibold text-green-700 dark:text-green-300">{new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(staff?.monthly_salary)}</p>
                              </div>
                        </div>

                        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-6">
                              <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-700 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Attendance Summary</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Days Worked: <span className="font-semibold text-gray-800 dark:text-white">{staff?.workdays}</span></p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Absent Days: <span  className="font-semibold text-gray-800 dark:text-white">{staff?.absent}</span></p>
                              </div>

                              <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-700 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Leave Information</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Max Leave Days: <span className="font-semibold text-gray-800 dark:text-white">5</span></p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Remaining Leave: <span className="font-semibold text-gray-800 dark:text-white">{staff?.avl_leave}</span> </p>
                              </div>
                        </div>

                        {/* Desktop View */}
                        <div className="hidden md:block p-4 rounded-xl bg-stone-100 dark:bg-stone-800 shadow-sm">
                              <h3 className="text-lg font-semibold text-stone-800 dark:text-white mb-3">Attendance History</h3>
                              <div className="overflow-y-auto h-40 scrollbar-hide">
                                    <table className="w-full text-sm border-collapse">
                                          <thead className="bg-stone-900 dark:bg-stone-600 sticky top-0">
                                                <tr className="text-center">
                                                      <th className="p-2 text-white dark:text-gray-300 w-50">Date</th>
                                                      <th className="p-2 text-white dark:text-gray-300 w-45">Time In</th>
                                                      <th className="p-2 text-white dark:text-gray-300 w-45">Time Out</th>
                                                      <th className="p-2 text-white dark:text-gray-300 w-60">Status</th>
                                                </tr>
                                          </thead>
                                          <tbody  className="text-gray-700 dark:text-gray-300">
                                                {attendanceHistory.length > 0 ? 
                                                      attendanceHistory.map((staff) => (
                                                            <tr key={staff.id} className="border-b border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800">
                                                                  <td className="p-2 text-center">{new Date(staff?.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric'})}</td>
                                                                  <td className="p-2 text-center">{staff.time_in}</td>
                                                                  <td className="p-2 text-center">{staff.time_out}</td>
                                                                  <td className="p-2 text-center">{staff.status}</td>
                                                            </tr>
                                                      ))
                                                :
                                                      <tr  className="border-b border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800">
                                                            <td colSpan={4} className="p-2 text-center text-stone-700 dark:text-stone-200">No attendance recorded.</td>
                                                      </tr>
                                                }
                                          </tbody>
                                    </table>
                              </div>
                        </div>

                        {/* Mobile View */}
                        <p className="block md:hidden text-sm font-semibold text-stone-800 dark:text-white">Attendance History</p>
                        <div className="md:hidden space-y-3 h-70 overflow-y-auto pt-2 scrollbar-hide">
                              {attendanceHistory.length > 0 ? 
                                    attendanceHistory.map((staff) => (
                                          <div key={staff.id}  className={`p-4 rounded-lg border cursor-pointer transition  bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800`}>
                                                <div>
                                                      <p className="font-semibold text-gray-900 dark:text-gray-100">{new Date(staff?.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric'})}</p>
                                                      <p className="text-xs text-gray-600 dark:text-gray-400 flex gap-1 items-center">Status: <span className="font-semibold">{staff.status}</span></p>
                                                      <p className="text-xs text-gray-600 dark:text-gray-400 flex gap-1 items-center">Time-In: <span className="font-semibold">{staff.time_in}</span></p>
                                                      <p className="text-xs text-gray-600 dark:text-gray-400 flex gap-1 items-center">Time-Out: <span className="font-semibold">{staff.time_out}</span></p>
                                                </div>
                                          </div>
                                    ))
                              :
                                    <div  className={`p-4 rounded-lg border cursor-pointer transition  bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800`}>
                                          <p className="text-xs text-stone-700 dark:text-stone-400 flex gap-1 items-center">No attendance recorded.</p>
                                    </div>
                              }
                        </div>
                  </div>
            </ModalWrapper>
      );
}