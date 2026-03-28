import { useState } from "react";
import { Edit, Loader2Icon, PlusSquare } from "lucide-react";
import { useMessageCard } from "../../context/MessageCardContext";
import { useAddStaff, useUpdateStaff } from "../../hooks/staffMgmtQueries";
import { capitalizeWords } from '../../shared/helper';
import Button from "../../shared/Button";
import ModalWrapper from "../modals/ModalWrapper";

export default function StaffModal({ closeModal, modalType, staff }){
      const { showMessage } = useMessageCard();
      const [ formData, setFormData ] = useState({
            staff_name: modalType === 'Update' ? staff.staff_name : '',
            date_started:  modalType === 'Update' ? new Date(staff.date_started).toISOString().split('T')[0] : '',
            daily_salary:  modalType === 'Update' ? staff.daily_salary : '',
            position:  modalType === 'Update' ? staff.job_position : '',
            avl_leave:  modalType === 'Update' ? staff.avl_leave : 5,
            status:  modalType === 'Update' ? staff.status : 'Active'
      });

      const { mutate: addStaff, isPending: addStaffLoading } = useAddStaff({ showMessage, closeModal });
      const { mutate: updateStaff, isPending: updateStaffLoading } = useUpdateStaff({ showMessage, closeModal });

      const handleFormSubmission = async(e) => {
            e.preventDefault();

            let finalData = { ...formData };
            if (modalType === 'Update') finalData = { ...finalData, staff_id: staff?.id } 

            modalType === 'Update' ? updateStaff(finalData) : addStaff(finalData);
      };

      return (
            <ModalWrapper modalTitle={modalType === 'Update' ? 'Update Staff Details' : 'Add New Staff'}
                  modalTitleDescription={modalType === 'Update' ? 'Update staffs personal details below.' : 'Add  new staffs and their personal details below.'}
                  closeModal={closeModal}
                  className={'md:w-[50%]'}
            >
                  <form onSubmit={handleFormSubmission}  className="flex flex-col gap-3 p-3  md:px-4 md:py-3">
                        <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                              <input type="text" value={formData.staff_name} onChange={(e) => setFormData({ ...formData, staff_name : capitalizeWords(e.target.value) })} style={{ textTransform: 'capitalize' }} placeholder="Enter full name" className="text-gray-900 w-full p-3 rounded-lg border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required/>
                        </div>
                  
                        <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position</label>
                              <select value={formData.position} onChange={(e) =>  setFormData({ ...formData, position : e.target.value})}  className="text-gray-900 w-full p-3 rounded-lg border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required>
                                    <option value="" hidden>Select Position</option>
                                    <option value="Front Desk">Front Desk</option>
                                    <option value="Security Guard">Security Guard</option>
                                    <option value="Janitor">Janitor</option>
                                    <option value="Maintenance">Maintenance</option>
                              </select>
                        </div>
                  
                        <div className="grid grid-cols-2 gap-4">
                              <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daily Salary (₱)</label>
                                    <input type="number"min="0" value={formData.daily_salary} onChange={(e) =>  setFormData({ ...formData, daily_salary : e.target.value})} placeholder="e.g., 500" className="text-gray-900  w-full p-3 rounded-lg border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required/>
                              </div>
                              <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Leave Days</label>
                                    <input type="number" min="0" value={formData.avl_leave} onChange={(e) =>  setFormData({ ...formData, avl_leave : e.target.value})}  readOnly={modalType === 'Add' ? true : false}   className="text-stone-900  w-full p-3 rounded-lg border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required/>
                              </div>
                        </div>
                  
                        <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Started</label>
                              <input type="date" value={formData.date_started} onChange={(e) =>  setFormData({ ...formData, date_started : e.target.value})}  className="date-icon text-stone-900  w-full p-3 rounded-lg border border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required/>
                        </div>
                        
                        {modalType === 'Update' && 
                              <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                    <select value={formData.status} onChange={(e) =>  setFormData({ ...formData, status : e.target.value})}  className="w-full p-3 rounded-lg border border-stone-300 dark:border-stone-700  text-stone-800 dark:text-stone-100dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" required>
                                          <option value="" hidden>Select Status</option>
                                          <option value="Active">Active</option>
                                          <option value="Absent">Absent</option>
                                          <option value="On Leave">On Leave</option>
                                    </select>
                              </div>
                        }
                  
                        <Button 
                              icon={ addStaffLoading || updateStaffLoading ? <Loader2Icon className="w-4 h-4 animate-spin text-white" /> : modalType === 'Add' ?  <PlusSquare className="w-4"/> :  <Edit className="w-4"/>} 
                              text={ 
                                    (addStaffLoading || updateStaffLoading) && modalType === 'Update' ? 'Updating...' 
                                    :  (addStaffLoading || updateStaffLoading) && modalType !== 'Update' ? 'Adding...'
                                    : modalType
                              } 
                              type={'submit'} 
                              disable={addStaffLoading || updateStaffLoading ? true : false}
                              className={'p-2.5 md:p-3 text-xs md:text-sm'}
                        />
                  </form>
            </ModalWrapper>
      );
}