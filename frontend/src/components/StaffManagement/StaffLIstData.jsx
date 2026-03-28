import { 
      BadgeCheckIcon, 
      CalendarOff, 
      Edit, 
      HelpCircle, 
      UserX, 
      Eye, 
      Trash, 
      Loader2Icon 
} from "lucide-react";
import { useModal } from "../../context/ModalContext";
import { useMessageCard } from "../../context/MessageCardContext";
import { useRemoveStaff, useStaffList } from "../../hooks/staffMgmtQueries";


export default function StaffListCard({ name }){
      const { showMessage } = useMessageCard();
      const { openModal } = useModal();

      const { data: staffsData, isLoading } = useStaffList(name);
      const staffs = staffsData?.data ?? [];

      const { mutate: removeStaff, isPending } = useRemoveStaff({ showMessage });

      const handleOpenModal = (modalName, staffData) => {
            openModal({ name : modalName, payload: staffData });
      };

      const handleRemoveConfirmation = (id) =>  {
            openModal({
                  name: 'confirm remove promo',
                  payload: {
                        message: 'Are you sure you want to remove this staff?',
                        buttonNameIdle: 'Remove',
                        subject: id,
                        clickEvent: removeStaff
                  }
            });
      };

      return (
            <ul  className="flex-1 overflow-y-auto space-y-2 p-2 md:p-3">
                  {staffs.length > 0 ? 
                        staffs.map(staff => (
                              <li  key={staff.id} className="p-4 rounded-xl bg-gray-50 border border-stone-300 dark:border-stone-700 dark:bg-stone-800 shadow-md flex justify-between items-center transition-all duration-200 ease-in-out hover:scale-101">
                                    <div>
                                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full
                                                ${staff.status === 'Active' ? 'bg-green-100 text-green-600 dark:bg-green-500 dark:text-white' :
                                                      staff.status === 'On Leave' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500 dark:text-white' :
                                                      staff.status === 'Absent' ? 'bg-red-100 text-red-600 dark:bg-red-500 dark:text-white' :
                                                      'bg-gray-200 text-gray-600'}
                                                `}
                                          >
                                                {staff.status === 'Active' ? <BadgeCheckIcon className="w-4 h-4"/> : staff.status === 'On Leave' ? <CalendarOff className="w-4 h-4"/> : staff.status === 'Absent' ? <UserX  className="w-4 h-4"/> : <HelpCircle  className="w-4 h-4"/>}
                                                {staff.status}
                                          </span>
                                          <div className="flex items-center gap-2">
                                                <span className="font-semibold text-[18px] md:text-lg text-gray-900 dark:text-gray-100">{staff.staff_name}</span>
                                          </div>
                                    
                                          <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{staff.job_position}</div>
                                    </div>
                                    
                                    <div className="flex gap-1 md:gap-2 ">
                                          <button onClick={() => handleOpenModal('view staff details', staff)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg">
                                                <Eye className="w-4 h-4 md:w-5 md:h-5"/>
                                          </button>
                                    
                                          <button onClick={() => handleOpenModal('update staff', staff)}  className="p-2 text-yellow-500 hover:bg-yellow-100 dark:hover:bg-gray-700 rounded-lg">
                                                <Edit className="w-4 h-4 md:w-5 md:h-5"/>
                                          </button>
                                    
                                          <button onClick={() => handleRemoveConfirmation(staff.id)}  className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-gray-700 rounded-lg">
                                                {isPending ? 
                                                      <Loader2Icon className="w-4 h-4 md:w-5 md:h-5 animate-spin text-red-500"/>
                                                : 
                                                      <Trash className="w-4 h-4 md:w-5 md:h-5"/>
                                                }
                                          </button>
                                    </div>
                              </li>
                        ))
                  :
                        <li  className="p-4 h-25  flex justify-center rounded-xl bg-gray-50 border border-stone-300 dark:border-stone-700 dark:bg-stone-800 shadow-md  items-center  transition-all duration-200 ease-in-out hover:scale-101">
                              <p className="text-xs md:text-base text-stone-700 dark:text-stone-200">No staff found.</p>
                        </li>
                  }
                  
            </ul>
      );
}