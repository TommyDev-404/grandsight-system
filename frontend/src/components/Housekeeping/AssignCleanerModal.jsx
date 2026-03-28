import { useState } from "react";
import { useMessageCard } from "../../context/MessageCardContext";
import { CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { useStaffCleaners, useAddCleaner } from "../../hooks/housekeepingQueries";
import ModalWrapper from "../modals/ModalWrapper";
import Button from "../../shared/Button";


export default function AssignCleanerModal({ data , setOpenAnotherModal}){
      const { showMessage } = useMessageCard();
      const { data: staffData, isLoading } = useStaffCleaners();
      const staffs = staffData?.data || [];

      const [ formData, setFormData ] = useState({
            area_name: data.completeAreaName,
            room_no: data.roomNo,
            cleaner_name: '',
            date: ''
      });

      const handleCloseModal = () => {
            setOpenAnotherModal({ name: null, payload : null });
      };

      const { mutate: addCleaner, isPending } = useAddCleaner({ showMessage, handleCloseModal })

      const handleFormSubmission = async(e) => {
            e.preventDefault();
            
            addCleaner(formData);
      };

      return (
            <ModalWrapper modalTitle={'Assign Cleaners'} modalTitleDescription={`Assign cleaners for each area and record its details.`} closeModal={handleCloseModal} className={'md:w-[60%]'}>
                  <form onSubmit={handleFormSubmission} className="p-3 md:px-4 md:py-3 flex flex-col gap-3">
                        <div className="text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-1">
                              <label className="text-xs md:text-sm text-stone-600 dark:text-stone-200">Select Staff:</label>
                              <select value={formData.name} onChange={(e) => setFormData({ ...formData, cleaner_name: e.target.value })} className="w-full  border border-stone-300 dark:border-stone-700 rounded-sm p-3 md:p-4 text-stone-700 dark:text-gray-100 dark:bg-stone-800  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
                                    {staffs.length > 0 ? 
                                          <>
                                                <option hidden>Choose Staff ↓</option>
                                                {staffs.map(staff => (
                                                      <option key={staff.staff_name} value={staff.staff_name}>{staff.staff_name}</option>
                                                ))}
                                          </>
                                    :
                                          <option>No staff available today.</option>
                                    }
                              </select>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-1">
                              <label className="text-xs md:text-sm text-stone-600 dark:text-stone-200">Date Assigned:</label>
                              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}  className="p-3 md:p-4 border border-stone-300 dark:border-stone-700 dark:text-stone-200 text-stone-700 rounded-sm" required/>
                        </div>

                        <Button 
                              icon={isPending ? <Loader2Icon className="w-4 h-4 animate-spin text-white" /> : <CheckCircle2Icon className="w-3 md:w-4" />}
                              text={isPending ? 'Assigning...' : 'Assign'} 
                              type={'submit'}  
                              disable={isPending ? true : false}
                              className={'p-2.5 md:p-3 text-xs md:text-sm'}
                        />
                  </form>
            </ModalWrapper>
      );
}