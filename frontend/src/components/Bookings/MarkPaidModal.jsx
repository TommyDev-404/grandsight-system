
import ModalWrapper from '../modals/ModalWrapper';
import Button from "../../shared/Button";
import { MdPayments } from "react-icons/md";
import { useMessageCard } from '../../context/MessageCardContext';
import { useState } from 'react';
import WarningCard from '../../shared/WarningCard';
import { useAddPaymentMethod } from '../../hooks/bookingQueries';
import { Loader2Icon } from 'lucide-react';

export default function MarkPaidModal({ closeModal, data, clearSelection }){
      const { showMessage } = useMessageCard();
      const [ isModalOpen, setModalOpen ] = useState({ open: null, message: null});
      const [ formData, setFormData ] = useState({
            id: data.booking_id,
            payment: "",
            date: "",
      });

      const { mutate: addPaymentMethod, isPending } = useAddPaymentMethod({
            showMessage,
            closeModal,
            clearSelection
      });

      const handleOpenWarningModal = (message) => {
            setModalOpen({ open: 'warningModal', message: message});
      };

      const handleFormSubmission = async (e) => {
            e.preventDefault();
            
            const isValid = formMiddleWare(formData, handleOpenWarningModal, data);

            if (!isValid) return; // stop form submission
            
            addPaymentMethod(formData);
      };
                  
      return (
            <ModalWrapper modalTitle={'Add Payment Method'} modalTitleDescription={`Add payment details for this booking.`} closeModal={closeModal} className={`md:w-[30%]`}>
                  {/* Payment Method  */}
                  <form  onSubmit={handleFormSubmission} className="flex flex-col gap-3 px-3 md:px-4 pb-3">
                        <div className="flex flex-col gap-0.5 mt-2">
                              <label className="text-xs md:text-sm text-stone-600 dark:text-stone-200">Select Payment Type:</label>
                              <select name="payment" value={formData.payment} onChange={(e) => setFormData({ ...formData, payment: e.target.value })}  className="border border-stone-300 p-4 rounded-sm text-stone-800 dark:text-white text-sm" required>
                                    <option className="text-gray-900" value="" hidden>Select Here</option>
                                    <option className="text-gray-900" value="Direct Payment">Direct Payment</option>
                                    <option className="text-gray-900" value="ZUZU (Online Payment)">ZUZU (Online Payment)</option>
                              </select>
                        </div>

                        <div className="flex flex-col gap-1 text-stone-600 dark:text-stone-200 text-xs md:text-sm">Date paid:
                              <input type="date" name="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value).toISOString().split("T")[0] })}   className="border border-stone-300 text-stone-600 dark:text-stone-100 p-4 rounded-sm text-sm"/>
                        </div>

                        {/* Submit Button */}
                        <Button
                              icon={isPending ? <Loader2Icon className="w-4 h-4 animate-spin text-white" /> : <MdPayments className="w-4 h-4"/>} 
                              text={isPending ? 'Adding...' : 'Add Payment'} 
                              type={'submit'}
                              disable={isPending ? true : false}
                              className={'text-xs md:text-sm p-2.5 md:p-3'}
                        />
                  </form>
                  {isModalOpen.open !== null &&  
                        <WarningCard message={isModalOpen.message} setModalOpen={setModalOpen}/>
                  }
            </ModalWrapper>
      );
}

function formMiddleWare(form, showWarning, data) {
      const bookStatus = data.status;
      const bookType= data.booking_type;
      const datePaid = new Date(form.date);
      const checkIn = new Date(data.check_in);
      const checkOut = new Date(data.check_out);
      const dateBooked = new Date(data.date_book);
      const today = new Date();

      // basic required check
      if (!form.payment || !form.date) {
            showWarning( "Please complete all fields.");
            return false;
      }

      if (bookStatus === "Reserved") {
            if (bookType === 'Day Guest'){
                  if (datePaid > today || datePaid < dateBooked){
                        showWarning("Warning: Payment date must not less that the check-in date or later than today for day guest reservation!");
                        return false;
                  }
            }else{
                  if (datePaid < dateBooked || datePaid > checkOut) {
                        showWarning("Warning: Payment date must be between reservation date and checkout for overnight reservation!");
                        return false;
                  }
            }
      } else {
            if (datePaid < checkIn || datePaid > checkOut) {
                  showWarning("Warning: Payment date must be between check-in and checkout!");
                  return false;
            }
      }

      return true; // ✅ VALID
}
