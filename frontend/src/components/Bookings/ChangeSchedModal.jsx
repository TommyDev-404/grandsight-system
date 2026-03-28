import { CalendarCheck2, Loader2Icon } from "lucide-react";
import ModalWrapper from "../modals/ModalWrapper";
import Button from "../../shared/Button";
import { useState } from "react";
import { useMessageCard } from "../../context/MessageCardContext";
import WarningCard from "../../shared/WarningCard";
import { useChangeBookingSchedule } from "../../hooks/bookingQueries";

export default function ChangeSchedModal({ closeModal, data, clearSelection }){
      const { showMessage } = useMessageCard();

      const [ isModalOpen, setModalOpen ] = useState({ open: null, message: null});
      const [ formData, setFormData ] = useState({
            id: data.booking_id,
            edit_checkin: new Date(data.check_in).toISOString().split("T")[0],
            edit_checkout:  new Date(data.check_out).toISOString().split("T")[0],
            booking_type: data.booking_type, 
            accomodations: data.accomodations,
            total_guest: data.total_guest,
            payment: data.payment
      });

      const { mutate: changeBookingSchedule, isPending } = useChangeBookingSchedule({
            showMessage,
            closeModal,
            clearSelection
      });

      const handleOpenWarningModal = (message) => {
            setModalOpen({ open: 'warningModal', message: message});
      };

      const handleFormSubmission = async (e) => {
            e.preventDefault();
            
            const isValid = formMiddleWare(formData, handleOpenWarningModal);
            if (!isValid) return; // stop form submission
            
            changeBookingSchedule(formData);
      };

      return (
            <ModalWrapper modalTitle={`Change Schedule`} modalTitleDescription={`Edit the booking schedule below.`} closeModal={closeModal} className={'md:w-[30%]'}>
                  
                  <form onSubmit={handleFormSubmission} className="flex flex-col gap-4 p-3 md:p-4" >

                        {data.status === "Reserved" && data.booking_type === "Day Guest" ? 
                              <div className="flex flex-col gap1 text-stone-600 dark:text-stone-400 text-xs md:text-sm">
                                    Check-In & Check-out Date:
                                    <input type="date" name="edit_checkin" value={formData.edit_checkin} onChange={(e) => setFormData({...formData, edit_checkin: e.target.value, edit_checkout: e.target.value})} className="border border-gray-300 text-gray-600 dark:text-gray-100 p-4 rounded-sm w-full"/>
                              </div>
                        : data.status === "Reserved" && data.booking_type === "Check-in" ?
                              <>
                                    <div className="flex flex-col gap1 text-stone-600 dark:text-stone-200 text-xs md:text-sm">
                                          Check-In:
                                          <input type="date" name="edit_checkin" value={formData.edit_checkin} onChange={(e) => setFormData({...formData, edit_checkin: e.target.value})} className="border border-stone-300 text-stone-600 dark:text-stone-100 p-4 rounded-sm w-full"/>
                                    </div>

                                    <div className="flex flex-col gap1 text-stone-600 dark:text-stone-200 text-xs md:text-sm">
                                          Check-Out:
                                          <input type="date" name="edit_checkout" value={formData.edit_checkout} onChange={(e) => setFormData({...formData, edit_checkout: e.target.value})} className="border border-gray-300 text-gray-600 dark:text-gray-100 p-4 rounded-sm w-full"/>
                                    </div>
                              </>
                        :
                              <div className="flex flex-col gap1 text-stone-600 dark:text-stone-200 text-xs md:text-sm">
                                    Check-Out:
                                    <input type="date" name="edit_checkout" value={formData.edit_checkout} onChange={(e) => setFormData({...formData, edit_checkout: e.target.value})} className="border border-gray-300 text-gray-600 dark:text-gray-100 p-4 rounded-sm w-full"/>
                              </div>
                        }

                        {/* Submit Button */}
                        <Button 
                              icon={isPending ? <Loader2Icon className="w-4 h-4 animate-spin text-white" /> : <CalendarCheck2 className="w-4 h-4"/>} 
                              text={isPending ? 'Updating...' :  'Update Schedule'} 
                              type={'submit'} 
                              disable={isPending ? true : false}
                              className={'p-2.5 md:p-3 text-xs md:text-sm'}
                        />
                  </form>

                  {isModalOpen.open !== null &&  
                        <WarningCard message={isModalOpen.message} setModalOpen={setModalOpen}/>
                  }
            </ModalWrapper>
      );
}

function formMiddleWare(form, showWarning) {
      const checkin = new Date(form.edit_checkin);
      const checkout = new Date(form.edit_checkout);
      const dateBook = new Date(form.date_book); // optional, if passed

      // Day Guest: check-in and check-out must be the same
      if (form.booking_type === 'Day Guest' && checkin.getTime() !== checkout.getTime()) {
            showWarning('Warning: Day guest checked-in and checked-out must be the same!');
            return false;
      }

      // Check-out cannot be less than check-in
      if (checkout < checkin) {
            showWarning('Warning: Checked-out date must not be less than checked-in date!');
            return false;
      }

      // Reserved booking: check-in >= booked date
      if (form.status === 'Reserved' && dateBook && checkin < dateBook) {
            showWarning('Warning: Checked-in date must not be less than the booked date!');
            return false;
      }

      // Reserved / Checked-in: check-out > check-in
      if (
            (form.status === 'Reserved' || form.status === 'Checked-in') &&
            form.booking_type === 'Check-in' &&
            checkout <= checkin
      ) {
            showWarning('Warning: Check-out date cannot be less than or equal to check-in date!');
            return false;
      }

      // all validations passed
      return true;
}
