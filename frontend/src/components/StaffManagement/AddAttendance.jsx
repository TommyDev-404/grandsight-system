import ModalWrapper from "../modals/ModalWrapper";
import { useState } from "react";
import { CheckCircleIcon, ClipboardCheck, Loader2Icon } from "lucide-react";
import Button from "../../shared/Button";
import { useMessageCard } from "../../context/MessageCardContext";
import WarningCard from "../../shared/WarningCard";
import { useAddStaffAttendance, useStaffsNotRecorded } from "../../hooks/staffMgmtQueries";

export const buildDate = (dateStr, timeStr) => {
      const date = new Date(dateStr);
      const [h, m] = timeStr.split(':').map(Number);
      date.setHours(h, m, 0, 0);
      return date;
};

const  isValidTimeIn = (selectedTime, staffDate) => {
      const timeIn = buildDate(staffDate, selectedTime);

      const earlyMorningStart = buildDate(staffDate, '06:00'); // 6 AM
      const earlyMorningEnd   = buildDate(staffDate, '08:00'); // 8 AM

      const noonStart = buildDate(staffDate, '12:00'); // 12 PM
      const noonEnd   = buildDate(staffDate, '13:00'); // 1 PM

      // Allow either 6–8 AM OR 12–1 PM
      if ((timeIn >= earlyMorningStart && timeIn <= earlyMorningEnd) ||
            (timeIn >= noonStart && timeIn <= noonEnd)) {
            return true;
      }

      // Otherwise invalid
      return false;
};

export default function AddAttendanceModal({ closeModal, date }){
      const { showMessage } = useMessageCard();
      const [ isModalOpen, setModalOpen ] = useState({});
      const [ formData, setFormData ] = useState({
            name: '',
            time_in: '',
            status: '',
            date: ''
      });
      const [ selectedId, setSelectedId ] = useState([]);

      const { data: staffsNotRecordedData, isLoading } = useStaffsNotRecorded(date?.month, date?.day);
      const staffsNotRecorded = staffsNotRecordedData?.data ?? [];

      const { mutate: addStaffAttendance, isPending } = useAddStaffAttendance({ showMessage, closeModal });

      const handleSelectAll = () => {
            setSelectedId(staffsNotRecorded.map(staff => staff.id));
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
                  setModalOpen({ open: 'warningModal', message: "Please select a staff before submittng."});
                  return; // stop submission
            }
            
            if (!isValidTimeIn(formData.time_in, formData.date)) {
                  setModalOpen({ open: 'warningModal', message: "Invalid time-in! Allowed are 6-8 AM and 12-1 PM for time-in."});
                  return;
            }

            // build array
            const data = selectedId.map(id => {
                  const staff = staffsNotRecorded.find(s => s.id === id);
                  
                  return {
                        id,
                        name: staff.staff_name,
                        status: formData.status,
                        date: formData.date,
                        time_in: formData.status === 'Absent' ? null : formData.time_in  
                  };
            });
            
            const finalData = {data };

            addStaffAttendance(finalData);
      };
      
      return (
            <ModalWrapper modalTitle={'Add Attendance'} modalTitleDescription={'Mark attendance for all staff on a specific date.'} closeModal={closeModal} className={'md:w-[50%]'}>
                  <form onSubmit={handleFormSubmission}  className="flex flex-col px-2 pb-3 md:px-3 md:py-3 gap-3">
                        <div className="h-80 md:h-auto overflow-y-auto scrollbar-hide px-1">
                              <div className="mb-4">
                                    <label className="text-sm md:text-[18px] font-medium text-gray-700 dark:text-gray-300 mb-1">Attendance Type:</label>
                                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}  className="px-3 py-2 min-w-full rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full">
                                          <option value="" hidden>Select Attendance Type</option>
                                          <option value="Present">Present</option>
                                          <option value="Absent">Absent</option>
                                    </select>
                              </div>
                        
                              <div className="mb-6 flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                          <label  className="text-sm md:text-[18px] font-medium text-gray-700 dark:text-gray-300 mb-1">Date:</label>
                                          <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="date-icon px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                                    </div>

                                    <div className="flex-1" >
                                          <label  className={`text-sm md:text-[18px] font-medium ${formData.status === 'Absent' ? 'text-stone-200' : 'text-stone-800'} dark:text-gray-300 mb-1`}>Time-in:</label>
                                          <input type="time" disabled={formData.status === 'Absent' ? true : false} value={formData.time_in} onChange={(e) => setFormData({ ...formData, time_in: e.target.value })} required className={` px-3 py-2 rounded-lg border  bg-stone-50 dark:bg-stone-800 ${formData.status === 'Absent' ?  'text-stone-200 border-stone-100 dark:border-stone-700' : 'text-stone-800 border-stone-300 dark:border-stone-700'} dark:text-stone-100 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}/>
                                    </div>
                              </div>

                              <div className="flex justify-start gap-4 items-center mb-4">
                                    <button type="button" onClick={handleSelectAll}  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition">Select All</button>
                                    <button type="button"  onClick={handleUnselectAll}  className="bg-stone-300 hover:bg-stone-400 dark:bg-stone-700 dark:hover:bg-stone-600 text-stone-800 dark:text-white px-4 py-2 rounded-lg text-sm transition">Unselect All</button>
                              </div>

                              {/* Desktop VIew */}
                              <div className="hidden md:block h-50 overflow-y-auto border border-stone-200 dark:border-stone-700 rounded-xl">
                                    <table className="w-full text-sm border-collapse">
                                          <thead className="bg-stone-900 dark:bg-stone-600 sticky top-0">
                                                <tr>
                                                      <th className="p-2 text-center text-white dark:text-gray-300">Select Here </th>
                                                      <th className="p-2 text-center text-white dark:text-gray-300">Staff Name</th>
                                                      <th className="p-2 text-center text-white dark:text-gray-300">Position</th>
                                                </tr>
                                          </thead>
                                          <tbody  className="text-gray-700 dark:text-gray-300">
                                                {staffsNotRecorded.length > 0 ?
                                                      staffsNotRecorded.map((staff) => (
                                                            <tr key={staff.id} className="border-b border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800">
                                                                  <td className="p-2 text-center">
                                                                        <input type="checkbox" checked={selectedId.includes(staff.id)} onChange={() => handleToggleStaff(staff.id)}  className="w-4 h-4" />
                                                                  </td>
                                                                  <td className="p-2 text-center">{staff.staff_name}</td>
                                                                  <td className="p-2 text-center">{staff.job_position}</td>
                                                            </tr>
                                                      ))
                                                :
                                                      <tr  className="border-b border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800">
                                                            <td colSpan={3} className="p-2 text-center text-stone-700 dark:text-stone-200">All staff this day has been recorded.</td>
                                                      </tr>
                                                }
                                          </tbody>
                                    </table>
                              </div>
                              
                              {/* Mobile VIew */}
                              <p className="block md:hidden border-b border-stone-300 dark:border-stone-700  pb-1 text-sm font-semibold text-stone-700 dark:text-white">All Staffs:</p>
                              <div className="md:hidden  h-50">
                                    <div className="space-y-3 h-full overflow-y-auto pt-2 bg-stone-50 px-2">
                                          {staffsNotRecorded.length > 0 ?
                                                staffsNotRecorded.map((staff) => (
                                                      <div onClick={() => handleToggleStaff(staff.id)} key={staff.id} className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex flex-col gap-3 ${ selectedId.includes(staff.id) ? "bg-green-50 border-green-300 ring ring-green-200 dark:bg-stone-900 dark:border-green-400 dark:ring-green-500/40" : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm dark:bg-stone-800 dark:border-stone-700"}`}>
                                                            {/* Header */}
                                                            <div className="flex items-center justify-between">
                                                                  <div>
                                                                        <p className="font-semibold text-stone-900 dark:text-stone-100">{staff.staff_name}</p>
                                                                        <p className="text-sm text-stone-500 dark:text-stone-400">{staff.job_position}</p>
                                                                  </div>
                                                            
                                                                  {/* Status Badge */}
                                                                  {selectedId.includes(staff.id) && (
                                                                        <p className="text-xs font-medium px-3 py-2 rounded-full bg-green-600 text-white flex gap-1 items-center">
                                                                              <CheckCircleIcon className="w-4 h-4"/>
                                                                              Selected
                                                                        </p>
                                                                        
                                                                  )}
                                                            </div>
                                                            
                                                            {/* Footer */}
                                                            <div className="flex justify-end">
                                                                  <p className="text-xs text-gray-500 dark:text-gray-400">{selectedId.includes(staff.id) ? "Tap again to unselect" : "Tap to select"}</p>
                                                            </div>
                                                      </div>
                                                ))
                                          :
                                                <div className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex flex-col gap-3 bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm dark:bg-stone-800 dark:border-stone-700`}>
                                                      <p className="text-xs text-gray-500 dark:text-gray-400">All staff this day has been recorded.</p>
                                                </div>
                                          }
                                    </div>
                              </div>
                        </div>
      
                        <Button 
                              icon={isPending ? <Loader2Icon className="w-4 h-4 animate-spin text-white" /> : <ClipboardCheck className="w-4 h-4"/>} 
                              text={isPending ? 'Adding...' : 'Save Attendance'} 
                              type={'submit'} 
                              disable={isPending ? true : false}
                              className={'p-3 text-xs md:text-sm'}
                        />
                  </form>
                  
                  {isModalOpen.open === 'warningModal' && <WarningCard message={isModalOpen.message} setModalOpen={setModalOpen} />}
            </ModalWrapper>
      );
}