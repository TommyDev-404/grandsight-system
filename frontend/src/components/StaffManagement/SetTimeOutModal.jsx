import { useState } from "react";
import { CheckCircleIcon, Loader2Icon, UploadIcon } from "lucide-react";
import { useMessageCard } from "../../context/MessageCardContext";
import { buildDate } from "./AddAttendance";
import { useStaffsNotTimeOuted, useUpdateStaffAttendance } from "../../hooks/staffMgmtQueries";
import Button from "../../shared/Button";
import ModalWrapper from "../modals/ModalWrapper";

const formatTo12Hour = (time) => {
      if (!time) return "--";

      const [hour, minute] = time.split(":");
      const date = new Date();
      date.setHours(hour);
      date.setMinutes(minute);

      return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
      });
};

const  isValidTimeout = (selectedTime, staffDate, timeIn) => {
      const timeout = buildDate(staffDate, selectedTime);

      const noonStart = buildDate(staffDate, '12:00');
      const noonEnd   = buildDate(staffDate, '13:00');

      const eveningStart = buildDate(staffDate, '16:30');

      // Prevent AM (before 12 PM)
      if (timeout < noonStart) {
            return false;
      }

      // Lunch time (12–1)
      if (timeout >= noonStart && timeout <= noonEnd) {
            return true;
      }

      //  5PM onwards
      if (timeout >= eveningStart) {
            return true;
      }

      return false;
}

export default function SetTimeOutModal({ closeModal, date }){
      const { showMessage } = useMessageCard();
      const [ formData, setFormData ] = useState({ time_out: ''});
      const [ selectedId, setSelectedId ] = useState([]);

      const { data: staffsNotTimeOutedData, isLoading } = useStaffsNotTimeOuted(date?.month, date?.day);
      const staffsNotTimeOuted = staffsNotTimeOutedData?.data ?? [];

      const { mutate: updateStaffAttendance, isPending } = useUpdateStaffAttendance({ showMessage, closeModal });

      const handleSelectAll = () => {
            setSelectedId(staffsNotTimeOuted.map(staff => staff.staff_id));
      };
      
      const handleUnselectAll = () => {
            setSelectedId([]);
      };

      const handleToggleStaff = (id) => {
            setSelectedId(prev => prev.includes(id) ? prev.filter(staffId => staffId !== id) : [...prev, id]);
      };

      const handleFormSubmission = async (e) => {
            e.preventDefault();

            if (selectedId.length === 0) {
                  showMessage({ status: 'failed', message: "Please select staff before submitting." });
                  return; // stop submission
            }
            
            for (const id of selectedId) {
                  const staff = staffsNotTimeOuted.find(s => s.staff_id === id);
            
                  if (!isValidTimeout(formData.time_out, staff.date, staff.time_in)) {
                        showMessage({
                              status: "failed",
                              message: "Invalid time-out! Time-out is allowed only between 12:00–1:00 PM for morning time-in, or from 4:30 PM onwards for both morning and afternoon time-ins."
                        });
                  
                        return; 
                  }
            }
            // build array
            const data = selectedId.map(id => {
                  const staff = staffsNotTimeOuted.find(s => s.staff_id === id);

                  return {
                        id,
                        name: staff.name,
                        date: staff.date,
                        time_in: staff.time_in,
                        time_out: formatTo12Hour(formData.time_out)
                  };
            });
            
            const finalData = { data };
            updateStaffAttendance(finalData);
      };
            
      return (
                  <ModalWrapper modalTitle={'Update Attendance'} modalTitleDescription={'Update staff attendance for all staff on a specific date.'} closeModal={closeModal} className={'md:w-[50%]'}>
                        <form onSubmit={handleFormSubmission} className="flex flex-col p-3 md:px-4 md:py-3 gap-3">
                              <div className=" flex justify-start w-full">
                                    <div className="flex flex-col">
                                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time-out:</label>
                                          <input type="time" value={formData.time_out} onChange={(e) => setFormData({ ...formData, time_out: e.target.value })} required className="px-3 py-2 w-50 md:w-90 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500  date-icon"/>
                                    </div>
                              </div>

                              <div className="flex justify-start gap-4 items-center">
                                    <button  type="button" onClick={handleSelectAll} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition">Select All</button>
                                    <button type="button" onClick={handleUnselectAll} className="bg-stone-300 hover:bg-stone-400 dark:bg-stone-700 dark:hover:bg-stone-600 text-gray-800 dark:text-white px-4 py-2 rounded-lg text-sm transition" >Unselect All</button>
                              </div>
                              
                              {/* Desktop View */}
                              <div className="hidden md:block overflow-x-auto max-h-87.5 border border-stone-200 dark:border-stone-700 rounded-xl">
                                    <table className="w-full text-sm border-collapse">
                                          <thead className="bg-stone-900 dark:bg-stone-600">
                                                <tr>
                                                      <th className="p-2 text-center text-white dark:text-gray-300">Select Here</th>
                                                      <th className="p-2 text-center text-white dark:text-gray-300">Staff Name</th>
                                                      <th className="p-2 text-center text-white dark:text-gray-300">Time In</th>
                                                </tr>
                                          </thead>
                                          <tbody  className="text-stone-700 dark:text-stone-300">
                                                {staffsNotTimeOuted.length > 0 ?
                                                      staffsNotTimeOuted.map((staff) => (
                                                            <tr key={staff.staff_id} className="border-b border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800">
                                                                  <td className="p-2 text-center">
                                                                        <input type="checkbox" checked={selectedId.includes(staff.staff_id)} onChange={() => handleToggleStaff(staff.staff_id)}  className="w-4 h-4" />
                                                                  </td>
                                                                  <td className="p-2 text-center">{staff.name}</td>
                                                                  <td className="p-2 text-center">{staff.time_in}</td>
                                                            </tr>
                                                      ))
                                                :
                                                      <tr  className="border-b border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800">
                                                            <td colSpan={3} className="p-2 text-center text-stone-700 dark:text-stone-200">No staff to record.</td>
                                                      </tr>
                                                }
                                          </tbody>
                                    </table>
                              </div>
                              
                              {/* Mobile View */}
                              <div>
                                    <p className="block md:hidden border-b border-stone-300 dark:border-stone-700  pb-1 text-sm font-semibold text-stone-700 dark:text-stone-400">Staff Time-in Data:</p>
                                    <div className="md:hidden space-y-3 h-30 overflow-y-auto bg-stone-50 p-2">
                                          {staffsNotTimeOuted.length > 0 ?
                                                staffsNotTimeOuted.map((staff) => (
                                                      <div onClick={() => handleToggleStaff(staff.staff_id)} key={staff.staff_id} className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex flex-col gap-3 ${ selectedId.includes(staff.staff_id) ? "bg-green-50 border-green-300 ring ring-green-200 dark:bg-stone-900 dark:border-green-400 dark:ring-green-500/40" : "bg-white border-gray-200 dark:bg-stone-800 dark:border-stone-700"}`}>
                                                            {/* Header */}
                                                            <div className="flex items-center justify-between">
                                                                  <div>
                                                                        <p className="font-semibold text-gray-900 dark:text-gray-100">{staff.name}</p>
                                                                        <p className="text-sm text-gray-500 dark:text-gray-400">{staff.position}</p>
                                                                  </div>
                                                            
                                                                  {/* Status Badge */}
                                                                  {selectedId.includes(staff.staff_id) && (
                                                                        <p className="text-xs font-medium px-3 py-2 rounded-full bg-green-600 text-white flex gap-1 items-center">
                                                                              <CheckCircleIcon className="w-4 h-4"/>
                                                                              Selected
                                                                        </p>
                                                                        
                                                                  )}
                                                            </div>
                                                            
                                                            {/* Footer */}
                                                            <div className="flex justify-end">
                                                                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedId.includes(staff.staff_id) ? "Tap again to unselect" : "Tap to select"}</p>
                                                            </div>
                                                      </div>
                                                ))
                                          : 
                                                <div className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex flex-col gap-3 bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm dark:bg-stone-800 dark:border-stone-700`}>
                                                      <p className="text-xs text-gray-500 dark:text-gray-400">All staff has been recorded.</p>
                                                </div>
                                          }
                                    </div>
                              </div>

                              <Button i
                                    icon={isPending ? <Loader2Icon className="w-4 h-4 animate-spin text-white" /> : <UploadIcon className="w-4 h-4"/>} 
                                    text={isPending ? 'Updating...' : 'Save Update'} 
                                    type={'submit'} 
                                    disable={isPending ? true : false}
                                    className={'p-2.5 md:p-3 text-xs md:text-sm'}
                              />
                        </form>
            </ModalWrapper>
      );
}