import { lazy, Suspense, useState } from "react";
import { 
      Building2Icon, 
      BuildingIcon, 
      Calendar, 
      CheckCircle, 
      ClipboardListIcon, 
      User,
      Loader2Icon, 
      Bed, Home, 
      Building2, 
      HelpCircle
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useMessageCard } from "../../context/MessageCardContext";
import { useAreaAvlSpaces, useAddBooking} from "../../hooks/bookingQueries";
import ModalWrapper from "../modals/ModalWrapper";
import Button from "../../shared/Button";
import WarningCard from "../../shared/WarningCard";
import { OverlaySpinner } from '../../shared/LoadingSpinner';
import { capitalizeWords } from '../../shared/helper';

const AreaAvlModal = lazy(() => import("./AreaAvlModal"));

export const areaConfig = {
      Room: {
            bg: "bg-blue-500",
            icon: <Bed className="text-white w-5" />
      },

      Cottage: {
            bg: "bg-green-500",
            icon: <Home className="text-white w-5" />
      },

      Hall: {
            bg: "bg-rose-500",
            icon: <Building2 className="text-white w-5" />
      },

      Other: {
            bg: "bg-gray-400",
            icon: <HelpCircle className="text-white w-5" />
      }
};


export default function AddBookingModal({ closeModal }){
      const BASE_FORM = {
            name: null,
            total_guest: null,
            booking_status: 'Reserved',
            booking_type: null,
            payment: null,
            accomodations_selected: [],
            checkin: null,
            checkout: null,
            book_date: null,
            date_paid_add: null
      };

      const { theme } = useTheme();
      const { showMessage } = useMessageCard();

      // react query
      const { data, isLoading } = useAreaAvlSpaces();
      const accommodationArea = data || [];
      const { mutate: addBooking, isPending: addBookingLoading } = useAddBooking({
            showMessage, 
            closeModal
      });

      const [ isModalOpen, setModalOpen ] = useState({});
      const [accommodationSelected, setAccomodationSelected] = useState([]);
      const [formData, setFormData] = useState(BASE_FORM);

      const handleOpenModal = (modalTitle) => {
            setModalOpen({ open: 'areaModal', title: modalTitle });
      };

      const handleOpenWarningModal = (message) => {
            setModalOpen({ open: 'warningModal', message: message});
      };

      const removeSelectedArea = (area) => {
            setAccomodationSelected(prev => prev.filter(a => a !== area));
      };    

      const handleFormSubmission = (e) => {
            e.preventDefault();
      
            const isValid = formMiddleWare(formData, handleOpenWarningModal);
            if (!isValid) return;
      
            const finalData = { ...formData, accomodations_selected: accommodationSelected.join(",") };
      
            addBooking(finalData);
      };

      return (
            <ModalWrapper modalTitle={'Add Booking'} modalTitleDescription={'Enter guest details and record their booking.'} closeModal={closeModal} className={'h-[95%] md:w-[60%] md:h-auto'}>
                  
                  <form onSubmit={handleFormSubmission}  className="flex flex-col gap-2 h-full overflow-auto px-2 pb-3 md:px-3">
                        <div className="flex flex-col gap-4 h-auto overflow-y-auto scrollbar-hide pt-2 px-1">

                              <section>
                                    <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-2 flex items-center gap-1 text-xs md:text-sm "><ClipboardListIcon className="w-4 md:w-5"/>Booking Info</h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                          <select name="booking_status" onChange={(e) => setFormData({...formData, booking_status: e.target.value})}  className="border border-stone-200 dark:border-stone-700 dark:text-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 p-3 rounded-md transition-all text-sm md:text-[18px]" required>
                                                <option className="text-black"  hidden>Select Booking Status</option>
                                                <option className="text-black" value="Checked-in">Checked-in</option>
                                                <option className="text-black" value="Reserved">Reservation</option>
                                          </select>
                                    
                                          <select name="booking_type" onChange={(e) => setFormData({...formData, booking_type: e.target.value})}  className="border border-stone-200 dark:border-stone-700 dark:text-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 p-3 rounded-md transition-all text-sm md:text-[18px]" required>
                                                <option className="text-black"   hidden>Select Booking Type</option>
                                                <option className="text-black" value="Check-in">Overnight (Room Stay)</option>
                                                <option className="text-black" value="Day Guest">Day Guest (No Room Stay)</option>
                                          </select>
                                    
                                          <select name="payment" onChange={(e) => setFormData({...formData, payment: e.target.value})}  className="border border-stone-200 dark:border-stone-700 dark:text-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 p-3 rounded-md transition-all " required>
                                                <option className="text-black"  hidden>Select Payment Type</option>
                                                <option className="text-black" value="Direct Payment">Direct Payment</option>
                                                <option className="text-black" value="ZUZU (Online Payment)">ZUZU (Online Payment)</option>
                                                <option className="text-black" value="Pending">Pending</option>
                                          </select>
                                    </div>
                              </section>

                              <section>
                                    <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-2 flex items-center gap-1 text-xs md:text-sm"><Calendar className="w-4 md:w-5"/> Schedule</h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                          <div>
                                                <label className={`${formData.booking_status === 'Reserved' ? 'text-stone-600 dark:text-stone-400' : 'text-stone-200 dark:text-stone-700'} text-[12px] md:text-xs mb-1 block`}>Date Book</label>
                                                <input type="date" name="book_date" disabled={formData.booking_status === 'Reserved' ? false : true} onChange={(e) => setFormData({...formData, book_date: e.target.value})}  className={`text-sm md:text-[18px] w-full border ${formData.booking_status === 'Reserved' ? ' dark:text-white text-stone-800' : ' dark:text-stone-700 text-stone-200'} border-stone-200 dark:border-stone-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 p-2 rounded-md transition-all`} required />
                                          </div>
                                    
                                          <div>
                                                <label className=" text-stone-600 dark:text-stone-400 text-[12px] md:text-xs mb-1 block">{formData.booking_type === 'Day Guest' ? 'Check-In & Check-Out Date' : 'Check-In Date '}</label>
                                                <input type="date" name="checkin" onChange={(e) => setFormData({...formData, checkin: e.target.value})}  className="text-sm md:text-[18px] w-full border date-icon border-stone-200 dark:border-stone-700 dark:text-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 p-2 rounded-md transition-all" required />
                                          </div>
                                    
                                          <div>
                                                <label className={`${formData.booking_type !== 'Day Guest' ? 'text-stone-600 dark:text-stone-400' : 'text-stone-200 dark:text-stone-700'}  text-[12px] md:text-xs mb-1 block`}>Check-Out Date</label>
                                                <input type="date" name="checkout" disabled={formData.booking_type === 'Day Guest' ? true : false}  onChange={(e) => setFormData({...formData, checkout: e.target.value})}  className={`text-sm md:text-[18px] w-full border border-stone-200 dark:border-stone-700 ${formData.booking_type !== 'Day Guest' ? ' dark:text-white text-stone-800' : ' dark:text-stone-700 text-stone-200'} focus:border-blue-500 focus:ring-1 focus:ring-blue-100 p-2 rounded-md transition-all`} required />
                                          </div>
                                    
                                          <div>
                                                <label className={`${formData.payment !== 'Pending' ? 'text-stone-600 dark:text-stone-400' : 'text-stone-200 dark:text-stone-700'}  text-[12px] md:text-xs mb-1 block`}>Date Paid</label>
                                                <input type="date" name="date_paid_add"  disabled={formData.payment === 'Pending' ? true : false}  onChange={(e) => setFormData({...formData, date_paid_add: e.target.value})}  className={`text-sm md:text-[18px] w-full border border-stone-200 dark:border-stone-700 ${formData.payment !== 'Pending' ? ' dark:text-white text-stone-800' : ' dark:text-stone-700 text-stone-200'} focus:border-blue-500 focus:ring-1 focus:ring-blue-100 p-2 rounded-md transition-all`} required />
                                          </div>
                                    </div>
                              </section>

                              <section className="border-b border-stone-200 dark:border-stone-700 pb-2">
                                    <h3 className="text-gray-700 dark:text-gray-300 font-semibold mb-2 flex items-center gap-1 text-xs md:text-sm"><User className="w-4 md:w-5"/> Guest Info</h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          <input type="text" name="name" onChange={(e) => setFormData({...formData, name: capitalizeWords(e.target.value)})} style={{ textTransform: "capitalize" }} placeholder="Guest Name"  className="text-sm md:text-[18px] border border-gray-300 dark:border-stone-700 dark:text-white text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 p-3 rounded-md transition-all" required />
                                          <input type="number" name="total_guest" onChange={(e) => setFormData({...formData, total_guest: e.target.value})}  placeholder="Total Guests" min="1" className="text-sm md:text-[18px] border dark:text-white text-gray-800 border-gray-300 dark:border-stone-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 p-3 rounded-md transition-all" required />
                                    </div>
                              </section>

                              <section className="border-b border-stone-200 dark:border-stone-700 pb-2">
                                    <h3 className="text-stone-700 dark:text-stone-300 font-semibold mb-2 flex items-center justify-center gap-2  text-xs md:text-sm"><BuildingIcon className="w-4 md:w-5"/>Accomodations</h3>

                                    <div className="grid md:grid-cols-4 gap-3 h-55 overflow-y-auto md:h-36 bg-stone-100 dark:bg-stone-700 border border-stone-200 dark:border-stone-700 p-2 rounded-sm  scrollbar-hide">
                                          {accommodationArea.map((acc) => (
                                                <button type="button" disabled={formData.booking_type === 'Check-in' && ['Hall', 'Cottage'].includes(acc) ? true : false } onClick={() => handleOpenModal(acc.area)} key={acc.area} className={`flex flex-col items-center justify-center ${areaConfig[acc.category]?.bg} text-white text-sm py-2 rounded-lg cursor-pointer transition-all active:scale-95`}>
                                                      {areaConfig[acc.category].icon}
                                                      <p className="flex items-center gap-2 text-white">{acc.area}<span>({acc.count})</span></p>
                                                </button>
                                          ))}
                                    </div>
                              </section>

                              <section >
                                    <h3 className="text-stone-700 dark:text-stone-300 font-semibold mb-2 flex items-center gap-2  text-xs md:text-sm"><Building2Icon className="w-4 md:w-5"/> Selected Accomodations</h3>
                                    <div className=" scrollbar-hide bg-stone-100 dark:bg-stone-700 w-full max-h-36 min-h-20 overflow-y-auto rounded-sm border border-stone-200 dark:border-stone-700 p-3">
                                          <div className=" grid md:grid-cols-4 grid-cols-1 gap-3 ">
                                                {accommodationSelected.length > 0 ? 
                                                      accommodationSelected.map((area, index) => (
                                                            <div key={index} className={`flex  relative bg-linear-to-r ${theme.base} ${theme.hover} px-2 py-4 rounded-sm`}>
                                                                  <p className="text-white">{area}</p>
                                                                  <button type="button" onClick={() => removeSelectedArea(area)} className={`text-xl text-stone-200 hover:text-red-400 absolute right-1 -top-0.5`}>&times;</button>
                                                            </div>
                                                      ))
                                                : 
                                                      <div className="text-stone-700 text-xs md:text-sm"> No selected accomodations yet.</div>
                                                }
                                          </div>
                                    </div>
                              </section>

                        </div>

                        <Button 
                              icon={addBookingLoading ? <Loader2Icon className="w-4 h-4 animate-spin text-white" /> : <CheckCircle className="w-3 md:w-4" />}
                              text={addBookingLoading ? 'Submitting...' : 'Submit'} 
                              type={'submit'} 
                              disable={addBookingLoading ? true : false}
                              className={'text-xs md:text-sm mt-0 md:mt-2 p-2 md:p-3'}
                        />
                  </form>

            {isModalOpen.open === 'areaModal' && 
                  <Suspense fallback={<OverlaySpinner/>}>
                        <AreaAvlModal 
                              title={isModalOpen.title} 
                              setModalOpen={setModalOpen} 
                              setAccomodationSelected={setAccomodationSelected} 
                              accomodationSelected={accommodationSelected}
                        />
                  </Suspense>
            }

            {isModalOpen.open === 'warningModal' &&  
                  <WarningCard message={isModalOpen.message} setModalOpen={setModalOpen}/>
            }
      </ModalWrapper>

      );
}

function formMiddleWare(formData, showWarningCard) {
      const today = new Date();
      today.setHours(0,0,0,0);

      const {
            booking_status,
            booking_type,
            checkin,
            checkout,
            book_date,
            payment,
            date_paid_add
      } = formData;

      const bookingStatus = booking_status;
      const bookingType = booking_type;

      const checkinDate = new Date(checkin);
      const checkoutDate = checkout ? new Date(checkout) : null;
      const bookDate = book_date ? new Date(book_date) : null;
      const datePaid = date_paid_add ? new Date(date_paid_add) : null;

      // normalize
      checkinDate?.setHours(0,0,0,0);
      checkoutDate?.setHours(0,0,0,0);
      bookDate?.setHours(0,0,0,0);
      datePaid?.setHours(0,0,0,0);

      // ================= CHECKED-IN =================
      if (bookingStatus === "Checked-in") {
      
            if (bookingType === "Day Guest" && checkinDate > today) {
                  showWarningCard("Invalid date: Day Guest check-in cannot be set to a future date unless it is a reservation.");
                  return false;
            }
      
            if (bookingType === "Check-in" && checkin === checkout) {
                  showWarningCard("Invalid date: For overnight stays, the check-in and check-out dates must not be the same.");
                  return false;
            }
      
            if (checkinDate > today) {
                  showWarningCard("Invalid date: Check-in date cannot be later than today.");
                  return false;
            }
      
            if (checkinDate.getFullYear() !== today.getFullYear()) {
                  showWarningCard("Invalid year: Booking records can only be added for the current year.");
                  return false;
            }
      }
      // ================= RESERVED =================
      else {

            if (bookingType === "Day Guest" && checkinDate < today) {
                  showWarningCard("Invalid date: Day Guest reservations must have a check-in date of today or later.");
                  return false;
            }
      
            if (bookingType === "Check-in" && checkin === checkout) {
                  showWarningCard("Invalid date: For overnight stays, the check-in and check-out dates must not be the same.");
                  return false;
            }
      
            if (bookDate > today) {
                  showWarningCard("Invalid date: Reservation date cannot be later than today.");
                  return false;
            }
      
            if (bookDate.getFullYear() !== today.getFullYear()) {
                  showWarningCard("Invalid year: Booking records are limited to the current year only.");
                  return false;
            }
      
            if (checkinDate.getFullYear() !== today.getFullYear()) {
                  showWarningCard("Invalid year: Check-in date must be within the current year.");
                  return false;
            }
      
            if (bookingType === "Check-in" && checkinDate < today) {
                  showWarningCard("Invalid date: Reserved overnight bookings must have a future check-in date.");
                  return false;
            }
      }

      // ================= PAYMENT =================
      if (payment !== "Pending") {
      
            // Checked-in Day Guest
            if (bookingStatus === "Checked-in" && bookingType === "Day Guest") {
                  if (datePaid.getTime() !== checkinDate.getTime()) {
                        showWarningCard("Invalid payment date: Day Guest payments must be made on the same day as check-in.");
                        return false;
                  }
            }
      
            // Reserved
            if (bookingStatus === "Reserved") {
                  if (bookingType === "Check-in") {
                        if (datePaid < bookDate || datePaid > checkoutDate) {
                              showWarningCard("Invalid payment date: Payment must be made between the reservation date and check-out.");
                              return false;
                        }
                  }
            
                  if (bookingType === "Day Guest") {
                        if (datePaid < bookDate || datePaid > checkinDate) {
                              showWarningCard("Invalid payment date: Day Guest reservation payments must be made between the reservation date and check-in.");
                              return false;
                        }
                  }
            }
      
            // Checked-in Overnight
            if (bookingStatus === "Checked-in" && bookingType === "Check-in") {
                  if (datePaid < checkinDate || datePaid > checkoutDate) {
                        showWarningCard("Invalid payment date: Payment must be made between the check-in and check-out dates.");
                        return false;
                  }
            }
      }

      return true;
}
