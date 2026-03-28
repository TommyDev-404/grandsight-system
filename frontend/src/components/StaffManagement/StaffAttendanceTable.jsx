import { useState, useEffect } from "react";
import { Clock, Loader2Icon, Trash2Icon } from "lucide-react"; // lucide icon for edit
import { useModal } from "../../context/ModalContext";
import { useRemoveStaffAttendance, useStaffAttendanceRecord } from "../../hooks/staffMgmtQueries";
import { useMessageCard } from "../../context/MessageCardContext";

const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
];

export default function StaffAttendanceTable() {
      const { openModal } = useModal();
      const { showMessage } = useMessageCard();
      const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
      const [selectedDay, setSelectedDay] = useState(new Date().getDate());
      const [ daysInMonth, setDaysInMonth ] = useState([]);

      const { data: attendanceRecordData, isLoading } = useStaffAttendanceRecord(selectedMonth, selectedDay);
      const attendanceRecord = attendanceRecordData?.data ?? [];

      const { mutate: removeStaffAttendance, isPending } = useRemoveStaffAttendance({ showMessage })

      const handleOpenModal = (modalName) => {
            openModal({ name : modalName, payload: { month: selectedMonth, day: selectedDay } });
      };
      
      const handleRemoveConfirmation = (staffAttendanceInfo) =>  {
            openModal({
                  name: 'confirm remove promo',
                  payload: {
                        message: 'Are you sure you want to remove this record?',
                        buttonNameIdle: 'Remove',
                        subject: staffAttendanceInfo,
                        clickEvent: removeStaffAttendance
                  }
            });
      };

      // auto set day based on month
      useEffect(() => {
            if (!selectedDay || !selectedMonth) return;

            // month-1 because JS Date month is 0-indexed
            const year = new Date().getFullYear();
            const daysCount = new Date(year, selectedMonth, 0).getDate(); // get the last date of the previous month
            const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1); // get the days in a month you selected

            setDaysInMonth(daysArray);
      }, [selectedDay, selectedMonth]);

      return (
            <div className="md:flex-1 md:p-6 p-3 overflow-y-auto bg-white dark:bg-stone-900 rounded-lg border border-stone-300 dark:border-stone-700 h-[calc(100vh-175px)] md:h-[calc(100vh-300px)]">
                  <h2 className="text-[16px] md:text-xl font-bold text-gray-900 dark:text-gray-100 text-center border-b border-stone-200 dark:border-stone-800 pb-1">Daily Attendance Overview</h2>

                  {/* Filters */}
                  <div className="mt-5 mb-5 relative">
                        <div className="flex gap-8 md:gap-4 justify-center md:justify-start">
                              <div className="flex items-center gap-2 relative">
                                    <label  className="text-[12px] md:text-[15px]  text-stone-700 dark:text-gray-100  absolute -top-4 left-1/2 -translate-x-1/2 md:relative  md:top-0 md:left-0 md:translate-0">Month:</label>
                                    <select value={selectedMonth}  onChange={(e) => setSelectedMonth(e.target.value)} className="py-1.5 md:py-2 px-4 border border-stone-300 rounded-sm dark:bg-stone-800 bg-stone-50 dark:text-stone-100 text-stone-700 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                          {months.map((month, index) => (
                                                <option key={index} value={index + 1}>
                                                      {month}
                                                </option>
                                          ))}
                                    </select>
                              </div>

                              <div className="flex items-center gap-2 relative overflow-visible relative">
                                    <label  className="text-[12px] md:text-[15px] text-gray-700 dark:text-gray-100  absolute -top-4 left-1/2 -translate-x-1/2 md:relative  md:top-0 md:left-0 md:translate-0">Day:</label>
                                    <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)} className="py-1.5 md:py-2 px-4 border border-stone-300 rounded-sm dark:bg-stone-800 bg-stone-50 dark:text-stone-100 text-stone-700 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                                          {daysInMonth.map(day => (
                                                <option key={day} value={day}>
                                                      {day}
                                                </option>
                                          ))}
                                    </select>
                              </div>
                        </div>

                        <div className="flex items-center gap-2 absolute md:right-0 right-0 top-10 md:-top-1 ">
                              <button onClick={() => handleOpenModal('set timeout')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs md:text-sm flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> Time Out
                              </button>

                              <button onClick={() => handleOpenModal('add attendance')} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg  text-xs md:text-sm">
                                    + Add
                              </button>
                        </div>
                  </div>
                  
                  {/* Table */}
                  <div className="h-[calc(100vh-345px)] md:h-100 overflow-y-auto mt-12 md:mt-0 scrollbar-hide">

                        {/* Desktop View */}
                        <div className="hidden md:block rounded-xl shadow-sm mt-15 md:mt-3">
                              <table className="min-w-full table-fixed">
                                    <colgroup>
                                          <col style={{ width: "180px" }} />
                                          <col style={{ width: "100px" }} />
                                          <col style={{ width: "100px" }} />
                                          <col style={{ width: "100px" }} />
                                          <col style={{ width: "200px" }} />
                                          <col style={{ width: "90px" }} />
                                    </colgroup>

                                    <thead className="bg-stone-900 dark:bg-white/20 text-white">
                                          <tr>
                                                <th className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider">Name</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider">Time In</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider">Time Out</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider">Date</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider">Status</th>
                                                <th className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider">Action</th>
                                          </tr>
                                    </thead>

                                    <tbody>
                                          {attendanceRecord.length > 0 ? 
                                                attendanceRecord.map((staff) => (
                                                      <tr key={staff.id} className="bg-stone-50 dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-white">
                                                            <td className="p-3 text-center">{staff.name}</td>
                                                            <td className="p-3 text-center">{staff.time_in}</td>
                                                            <td className="p-3 text-center">{staff.time_out}</td>
                                                            <td className="p-3 text-center whitespace-nowrap">{new Date(staff.date).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'})}</td>
                                                            <td className="p-2 text-center flex justify-center">
                                                                  <p className={`py-1.5 px-5 rounded-sm  text-white font-semibold text-xs ${staff.status === 'Absent' ? 'bg-red-500' :  staff.status === '--' ? 'bg-stone-400' : 'bg-green-500'}`}>{staff.status}</p>
                                                            </td>
                                                            <td className="p-2 text-center ">
                                                                  <button onClick={() => handleRemoveConfirmation({ id: staff.staff_id, status: staff.status, date: new Date(staff.date).toISOString().split('T')[0] })} >
                                                                        {isPending ? 
                                                                              <Loader2Icon className="w-4 h-4 md:w-5 md:h-5 animate-spin text-red-500"/>
                                                                        : 
                                                                              <Trash2Icon className="w-4 h-4 md:w-5 md:h-5 text-red-500"/>
                                                                        }
                                                                  </button>
                                                            </td>
                                                      </tr>
                                                ))
                                          : 
                                                <tr  className="border-b border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-white">
                                                      <td  colSpan={6} className="p-3 text-center text-stone-700 dark:text-stone-200">No attendance record.</td>
                                                </tr>
                                          }
                                    </tbody>
                              </table>
                        </div>

                        {/* Mobile View */}
                        <div className="block md:hidden py-1 space-y-4">
                              {attendanceRecord.length > 0 ? (
                                    attendanceRecord.map(staff => (
                                          <div key={staff.id} className="bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-4 shadow-sm flex flex-col gap-3">
                                                {/* Header */}
                                                <div className="flex flex-col items-start">
                                                      <span className={`text-[11px] font-semibold px-3 py-1 rounded-full text-white ${
                                                            staff.status === "Absent"
                                                            ? "bg-red-500"
                                                            : staff.status === "--"
                                                            ? "bg-stone-400"
                                                            : "bg-green-500"
                                                            }`}
                                                      >
                                                            {staff.status}
                                                      </span>
                                                      <div>
                                                            <p className="font-semibold text-stone-900 dark:text-white text-base">{staff.name}</p>
                                                            <p className="text-xs text-stone-500 dark:text-stone-400">{new Date(staff.date).toLocaleDateString('en-US', {month: 'short',day: '2-digit',year: 'numeric'})}</p>
                                                      </div>
                                                </div>

                                                {/* Body */}
                                                <div className="grid grid-cols-2 gap-3 text-sm text-stone-700 dark:text-stone-300">
                                                      <div>
                                                            <p className="text-xs text-stone-400">Time In</p>
                                                            <p>{staff.time_in || "--"}</p>
                                                      </div>

                                                      <div>
                                                            <p className="text-xs text-stone-400">Time Out</p>
                                                            <p>{staff.time_out || "--"}</p>
                                                      </div>
                                                </div>

                                                {/* Footer */}
                                                <div className="flex justify-end pt-2">
                                                      <button onClick={() => handleRemoveConfirmation({ id: staff.staff_id, status: staff.status, date: staff.date })} className={` flex gap-2 items-center text-sm py-1.5 px-3 bg-red-500 rounded-sm text-white`}>
                                                            {isPending ? 
                                                                  <>
                                                                        <Loader2Icon className="w-4 h-4 md:w-5 md:h-5 animate-spin text-red-500"/>
                                                                        Removing...
                                                                  </>
                                                            : 
                                                                  <>
                                                                        <Trash2Icon className="w-4 h-4 md:w-5 md:h-5"/>
                                                                        Remove
                                                                  </>
                                                            }
                                                      </button>
                                                </div>
                                          </div>
                                    ))
                              ) : (
                                    <div className="bg-stone-50 dark:bg-stone-800 flex justify-center h-40 items-center rounded-lg border border-stone-200 dark:border-stone-700">
                                          <p className="text-center text-sm text-stone-600 dark:text-stone-300">
                                                No attendance record.
                                          </p>
                                    </div>
                              )}
                        </div>
                  </div>

            </div>
      );
}
