import { useEffect, useState, useMemo } from "react";
import { useModal } from "../../context/ModalContext";
import { useTheme } from "../../context/ThemeContext";
import { useMessageCard } from "../../context/MessageCardContext";
import { 
      CreditCardIcon, 
      EditIcon, 
      LogInIcon, 
      LogOutIcon, 
      SearchIcon, 
      TrashIcon, 
      Eye, 
      ArrowRight, 
      ArrowLeft, 
      PlusCircleIcon, 
      Loader2Icon 
} from "lucide-react";
import { 
      useCancelBooking, 
      useCheckinBooking, 
      useCheckOutBooking, 
      useBookingData 
} from "../../hooks/bookingQueries";
import { capitalizeWords } from '../../shared/helper';

const tabs = [
      { key: "all", label: "All" },
      { key: "check_in", label: "Check-In" },
      { key: "reserved", label: "Reserved" },
      { key: "overnight", label: "Overnights" },
      { key: "day_guest", label: "Day Guests" },
];


export default function BookingTable({ year, month, day }){
      const { theme } = useTheme();
      const { openModal } = useModal();
      const { showMessage } = useMessageCard();

      const [ currentPage, setPage] = useState(1); // store the currentPage
      const [ category, setCategory ] = useState('all');
      const [ nameSearch, setNameSearch ] = useState("");
      const [ bookingSelected, setBookingSelected ] = useState(null); 
      const isDisabled = (permission) => !bookingSelected || !permission; // return true if no booking selected or there is no valid permission
      
      const { data: bookingData, isLoading: bookingDataLoading } = useBookingData({ category, currentPage, year, month, day, nameSearch });
      const recentData = bookingData?.data || [];
      const totalData = bookingData?.total;
      const totalPages = Math.ceil(totalData / 10 ); // store the total page
      const bookingTotalCount = bookingData?.count;
      
      const clearSelection = () => setBookingSelected(null);

      const { mutate: checkIn, isPending: checkInLoading } = useCheckinBooking({ showMessage, clearSelection });
      const { mutate: checkOut, isPending: checkOutLoading } = useCheckOutBooking({ showMessage, clearSelection });
      const { mutate: cancelBooking, isPending:cancelBookingLoading } = useCancelBooking({ showMessage, clearSelection });
      
      const permissions = useMemo(() => {
            if (!bookingSelected) return {};
      
            const today = new Date();
            const reservationDate = new Date(bookingSelected.check_in);
            const checkoutDate = new Date(bookingSelected.check_out);
      
            const paid = bookingSelected.payment !== "Pending";
            const status = bookingSelected.status;
            const type = bookingSelected.booking_type;
      
            return {
                  canMarkPaid: !paid,
      
                  canCheckIn:
                        status === "Reserved" &&
                        reservationDate <= today,
      
                  canCheckOut:
                        status === "Checked-in" && (checkoutDate === today || checkoutDate < today) && paid,
      
                  canCancel:
                        status === "Reserved" && status !== "Checked-out",
      
                  canChangeDate:
                        status === "Reserved" || (status === "Checked-in" && type !== "Day Guest")
            };
      }, [bookingSelected]); // dependency array
      
      const handleOpenModal = (modalName, guestDetails=null) => {
            if (modalName === 'add booking') clearSelection();
            
            openModal({
                  name: modalName,
                  payload: {
                        data: modalName === 'view guest details' ? guestDetails : modalName === 'add booking' ? null : bookingSelected,
                        clearSelection
                  }
            });
      };
      
      const handleSelectedBooking = (booking) => {
            setBookingSelected(prev => (prev?.booking_id === booking.booking_id ? null : booking));
      };
      
      const handleCheckOut = async() => {
            checkOut({ 
                  booking_id: bookingSelected.booking_id, 
                  accomodations: bookingSelected.accomodations 
            });
      };    

      const handleCheckIn= async() => {
            checkIn({ 
                  booking_id: bookingSelected.booking_id, 
                  accomodations: bookingSelected.accomodations 
            });
      };    

      const handleCancelBooking= async() => {
            cancelBooking({ 
                  booking_id: bookingSelected.booking_id, 
                  accomodations: bookingSelected.accomodations 
            });
      };    
      
      // reset the page count when fetching another data 
      useEffect(() => {
            setPage(1);
      }, [year, month, day]);

      return (                              
            <div className="bg-white dark:bg-stone-900 rounded-lg shadow-md flex flex-col h-[calc(100vh-250px)] overflow-hidden md:h-auto border border-stone-200 dark:border-stone-700 pb-3 md:pb-0 mt-3">
                  {/* Tabs */}
                  <div>
                        <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700">
                              <div className="flex overflow-x-auto no-scrollbar">

                                    {tabs.map(tab => (
                                          <button
                                                key={tab.key}
                                                onClick={() => (setCategory(tab.key), clearSelection())}
                                                className={`relative px-6 py-2 text-xs md:text-sm whitespace-nowrap border-b-2 transition-all duration-200
                                                      ${
                                                            category === tab.key
                                                            ? "border-blue-500 text-blue-600 dark:text-white bg-stone-100 dark:bg-stone-700"
                                                            : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white"
                                                      }
                                                `}
                                    >
                                          {tab.label}
                                          {bookingTotalCount?.[tab.key] > 0 && (
                                          <span className="absolute top-1 right-1.5 min-w-4.5 h-4.5 px-1 text-[10px] flex items-center justify-center bg-red-500 text-white rounded-full">
                                                {bookingTotalCount[tab.key]}
                                          </span>
                                          )}
                                          </button>
                                    ))}
                              </div>
                        </div>
                  </div>

                  {/* Action Buttons + Search */}
                  <div  className="flex flex-wrap items-center justify-between gap-4 px-2 py-3 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700 relative">
                        <div   className="flex flex-wrap gap-2 order-2 md:order-0">
                              <button
                                    onClick={() => handleOpenModal('change schedule')}
                                    className="active:scale-95 flex items-center gap-2 bg-teal-500 text-white text-sm md:px-4 md:py-2.5 py-2 px-2 rounded-lg shadow hover:bg-teal-600 transition disabled:opacity-30 disabled:pointer-events-none"
                                    disabled={isDisabled(permissions.canChangeDate)}
                              >
                                    <EditIcon className="w-4 h-4 md:w-5 md:h-5" />
                                    <span className="hidden md:block">Change Date</span>
                              </button>

                              <button
                                    onClick={() => handleOpenModal('mark paid')}
                                    className="active:scale-95 flex items-center gap-2 bg-green-500 text-white md:px-4 md:py-2 px-2 text-sm rounded-lg shadow hover:bg-green-600 transition disabled:opacity-30 disabled:pointer-events-none"
                                    disabled={isDisabled(permissions.canMarkPaid)}
                              >
                                    <CreditCardIcon className="w-4 h-4 md:w-5 md:h-5" />
                                    <span className="hidden md:block">Mark Paid</span>
                              </button>

                              <button
                                    className="active:scale-95 flex items-center gap-2 bg-blue-500 text-white md:px-4 px-2 text-sm rounded-lg shadow hover:bg-blue-600 transition disabled:opacity-30 disabled:pointer-events-none"
                                    onClick={handleCheckIn}
                                    disabled={isDisabled(permissions.canCheckIn)}
                              >
                                    {checkInLoading ? 
                                          <>
                                                <Loader2Icon className="w-4 h-4 animate-spin text-white" /> 
                                                <span className="hidden md:block">Processing...</span>
                                          </>
                                    :
                                          <>
                                                <LogInIcon className="w-4 h-4 md:w-5 md:h-5" />
                                                <span className="hidden md:block">Check-In</span>
                                          </>
                                    }
                              </button>

                              <button
                                    className="active:scale-95 flex items-center gap-2 bg-amber-500 text-white md:px-4 md:py-2 px-2 text-sm rounded-lg shadow hover:bg-amber-600 transition disabled:opacity-30 disabled:pointer-events-none"
                                    onClick={handleCheckOut}
                                    disabled={isDisabled(permissions.canCheckOut)}
                              >
                                    {checkOutLoading ? 
                                          <>
                                                <Loader2Icon className="w-4 h-4 animate-spin text-white" /> 
                                                <span className="hidden md:block">Processing...</span>
                                          </>
                                    :
                                          <>
                                                <LogOutIcon className="w-4 h-4 md:w-5 md:h-5" />
                                                <span className="hidden md:block">Check-Out</span>
                                          </>
                                    }
                              </button>

                              <button
                                    className="active:scale-95 flex items-center gap-2 bg-rose-500 text-white md:px-4 md:py-2 px-2 py-1.5 text-sm rounded-lg shadow hover:bg-rose-600 transition disabled:opacity-30 disabled:pointer-events-none"
                                    onClick={handleCancelBooking}
                                    disabled={isDisabled(permissions.canCancel)}
                              >
                                    {cancelBookingLoading ? 
                                          <>
                                                <Loader2Icon className="w-4 h-4 animate-spin text-white" /> 
                                                <span className="hidden md:block">Processing...</span>
                                          </>
                                    :
                                          <>
                                                <TrashIcon className="w-4 h-4 md:w-5 md:h-5" />
                                                <span className="hidden md:block">Cancel Booking</span>
                                          </>
                                    }
                              </button>
                        </div>

                        <div className="relative w-105 order-1 md:order-0 -mt-1 md:mt-0">
                              <input type="text" placeholder="Search guest name…" value={nameSearch} onChange={(e) => setNameSearch(capitalizeWords(e.target.value))} style={{ textTransform: "capitalize" }} className={`w-full pl-11 pr-4 py-2 text-sm md:text-[18px] rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-white focus:ring-2 focus:ring-${theme}-400 outline-none transition`}/>
                              <SearchIcon className="absolute top-2.5 left-3 text-stone-400 w-4 h-4 md:w-5 h-5"/>
                        </div>

                        <button onClick={() => handleOpenModal('add booking')} type="button" className="md:hidden block absolute top-15 right-2 z-100 bg-green-500 px-1.5 py-1.5 text-white rounded-xl shadow-2xl">
                              <PlusCircleIcon className="w-5 h-5"/>
                        </button>
                  </div>
                                          
                  {/* DESKTOP VIEW - Table */}
                  <div className="hidden md:flex">
                        <div className="w-full overflow-y-auto h-87 ">
                              <table className="min-w-full text-sm text-center border-collapse">
                                    <thead className=" bg-stone-800 dark:bg-stone-700 text-white sticky top-0 z-10">
                                          <tr>
                                                <th className="p-3">Select</th>
                                                <th className="p-3">Guest Name</th>
                                                <th className="p-3">Date Book</th>
                                                <th className="p-3">Booking Sched.</th>
                                                <th className="p-3">Accommodations</th>
                                                <th className="p-3">Booking Type</th>
                                                <th className="p-3">Status</th>
                                                <th className="p-3">Payment</th>
                                                <th className="p-3">Action</th>
                                          </tr>
                                    </thead>

                                    <tbody className="bg-white dark:bg-stone-900">
                                          {recentData.length <= 0 ? 
                                                <tr className="border-b border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 ">
                                                      <td colSpan={9} className="text-md p-4 text-stone-700 dark:text-stone-200">No booking found.</td>
                                                </tr>
                                          :
                                                recentData.map((b) => (
                                                      <tr key={b.booking_id} className="border-b border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200">
                                                            <td className="p-3">
                                                                  <input  type="checkbox" value={b.booking_id} checked={bookingSelected?.booking_id === b.booking_id} onChange={() => handleSelectedBooking(b)} readOnly  className="w-5 h-5 cursor-pointer rounded-2xl"/>
                                                            </td>
                                                            <td className="p-3 font-semibold">{b.name}</td>
                                                            <td className="p-3">{new Date(b.date_book).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</td>
                                                            <td className="p-3">
                                                                  <div className="flex flex-col items-center justify-center h-full text-center">
                                                                        {new Date(b.check_in).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} -
                                                                        {new Date(b.check_out).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}

                                                                        {(() => {
                                                                              const checkIn = new Date(b.check_in);
                                                                              const checkOut = new Date(b.check_out);
                                                                              const diffTime = checkOut - checkIn;
                                                                              const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                                                              return nights > 0 && (
                                                                                    <span className="text-xs text-stone-500 dark:text-stone-400">
                                                                                          ({nights} {nights > 1 ? "nights" : "night"})
                                                                                    </span>
                                                                                    );
                                                                        })()}
                                                                  </div>
                                                            </td>

                                                            <td className="p-3">{b.accomodations}</td>
                                                            <td className="p-3">{b.booking_type === 'Check-in' ? 'Overnight' : 'Day Guest'}</td>
                                                            <td className="p-3">
                                                                  <span className={`px-2 py-1 rounded text-xs ${
                                                                  b.status === "Checked-in"
                                                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-500 dark:text-white"
                                                                        : b.status === "Reserved"
                                                                        ? "bg-green-100 text-green-700 dark:bg-green-500 dark:text-white"
                                                                        : b.status === "Cancelled" 
                                                                        ? "bg-rose-100 dark:bg-rose-500 dark:text-white text-rose-700"
                                                                        : "bg-orange-100 dark:bg-orange-500 dark:text-white text-orange-700"
                                                                  }`}>
                                                                  {b.status}
                                                                  </span>
                                                            </td>
                                                            <td className="p-3 text-xs">
                                                                  <span className={` rounded-sm py-1 px-2 dark:text-white ${b.payment !== "Pending" ? "text-green-600  bg-green-100 dark:bg-green-500" : "text-red-600 bg-red-100 dark:bg-red-500"}`}>
                                                                  {b.payment}
                                                                  </span>
                                                            </td>
                                                            <td className="p-3">
                                                                  <button  onClick={() => handleOpenModal('view guest details', b)} className={`text-white text-sm bg-linear-to-r ${theme.base}  ${theme.hover} py-2 px-3 rounded-full flex items-center gap-1 transition-all active:scale-95`}>
                                                                        <Eye size={16} />View
                                                                  </button>
                                                            </td>
                                                      </tr>
                                                ))
                                          }
                                    </tbody>
                              </table>
                        </div>
                  </div>
                  
                  {/* MOBILE VIEW - Card */}
                  <div className="block md:hidden space-y-3 p-2 h-screen overflow-y-auto scrollbar-hide" >
                        {recentData.length <= 0 ? 
                              <div  className={` p-4 rounded-lg border cursor-pointer transition bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 h-50 flex justify-center items-center`}>
                                    <p className="text-sm text-stone-600 dark:text-stone-200">No booking found for this date.</p>
                              </div>
                        :
                              recentData.map((b) => (
                                    <div  key={b.booking_id} onClick={() => handleSelectedBooking(b)} className={` p-4 rounded-lg border cursor-pointer transition  ${bookingSelected?.booking_id === b.booking_id ? "bg-blue-50 border-blue-400 dark:bg-blue-900/20" : "bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800"}`}>
                                          {/* Top Row: Guest Name + Status */}
                                          <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-semibold text-stone-800 dark:text-stone-100">{b.name}</h3>
                                                <span className={`px-2 py-1 rounded text-xs ${b.status === "Checked-In" ? "bg-blue-100 text-blue-700 dark:bg-blue-500 dark:text-white" : b.status === "Reserved" ? "bg-green-100 text-green-700 dark:bg-green-500 dark:text-white" :  b.status === "Checked-out" ||  b.status === "Cancelled"  ? "bg-red-100 text-red-700 dark:bg-red-500 dark:text-white" : "bg-yellow-100 text-yellow-500 dark:bg-yellow-500 dark:text-white"}`}>
                                                      {b.status}
                                                </span>
                                          </div>

                                          {/* Details Grid */}
                                          <div className="grid grid-cols-1  text-sm text-stone-600 dark:text-stone-300 mb-2 gap-2 mt-3">
                                                <div className="flex flex-col">
                                                      <strong className="text-xs">Date Book:</strong> 
                                                      {new Date(b.date_book).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                                                </div>
                                                <div className="flex flex-col">
                                                      <strong className="text-xs">Schedule: </strong>
                                                      <div className="flex items-center gap-2">
                                                            {new Date(b.check_in).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} - {new Date(b.check_out).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                                                            {(() => {
                                                                  const checkIn = new Date(b.check_in);
                                                                  const checkOut = new Date(b.check_out);
                                                                  const diffTime = checkOut - checkIn;
                                                                  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                                                  return nights > 0 && (
                                                                        <span className="text-xs text-stone-500 dark:text-stone-400">
                                                                              ({nights} {nights > 1 ? "nights" : "night"})
                                                                        </span>
                                                                        );
                                                            })()}
                                                      </div>
                                                            
                                                </div>
                                                <div className="flex flex-col">
                                                      <strong className="text-xs">Accomodations:</strong> 
                                                      {b.accomodations}
                                                </div>
                                                <div className="flex flex-col">
                                                      <strong className="text-xs">Type:</strong> 
                                                      {b.booking_type === 'Check-in' ? 'Overnight' : 'Day Guest'}
                                                </div>
                                                <div className="flex flex-col">
                                                      <strong className="text-xs">Payment: </strong>
                                                      <span className={b.payment !== "Paid" ? "text-green-600" : "text-red-600"}>{b.payment}</span>
                                                </div>
                                          </div>

                                          {/* Bottom Action Row */}
                                          <div className="flex justify-between items-center pt-2 border-t dark:border-stone-700">
                                                <span className="text-xs text-stone-500 dark:text-stone-400">{bookingSelected?.booking_id === b.booking_id ? "Selected ✅" : "Tap to select"}</span>
                                                      <button onClick={(e) => { e.stopPropagation(); handleOpenModal('view guest details', b)}}  className="flex items-center gap-1 bg-purple-500 py-2 px-3 rounded-full text-white hover:underline text-sm"><Eye size={16} />View
                                                </button>
                                          </div>
                                    </div>
                              ))}
                  </div>
            
                  <div className="flex justify-between md:pb-2 pt-2 border-t border-stone-200 w-full px-2 md:px-4 items-center flex-col md:flex-row gap-2 dark:border-stone-400">
                        <div className="flex items-center w-full justify-between">
                              <div className="flex items-center gap-1">
                                    <p className="text-gray-600 font-semibold text-sm dark:text-gray-400">Page</p> 
                                    <span className="text-sm text-stone-500 dark:text-stone-300">{totalData > 0 ? currentPage : 0}/{totalPages}</span>
                              </div>

                              <div className="flex gap-1 items-center">
                                    {Array.from({length: Number(totalPages)}, (_, i) => i + 1).map((page, index) => (
                                          <p key={index} className={`${currentPage === page ? `bg-linear-to-r ${theme.base} ${theme.hover} text-white` : 'bg-stone-300 text-black dark:text-white dark:bg-stone-700' } border border-stone-300 py-1.5 px-2 md:px-3  rounded-sm text-[10px] md:text-xs font-semibold`}>{page}</p>
                                    ))}
                              </div>
                        </div>

                        <div className="flex justify-between md:justify-end items-center gap-3 w-full">
                              <button disabled={currentPage <= 1 ? true : false} onClick={() => setPage(currentPage - 1 > 0 ? currentPage - 1 : currentPage)} className={`bg-stone-500  hover:bg-stone-600 dark:bg-stone-600  py-1.5 px-3 md:py-2 md:px-4 rounded-lg text-white flex gap-1 items-center text-xs md:text-sm`}>
                                    <ArrowLeft className="w-3 md:w-4"/>
                                    Previous
                              </button>

                              <button  disabled={currentPage === totalPages || totalPages === 0 ? true : false}  onClick={() => setPage(currentPage + 1 <= totalPages ? currentPage + 1 : currentPage)} className={`bg-linear-to-r ${theme.base} ${theme.hover} py-1.5 px-3 md:py-2 md:px-4 rounded-lg text-white flex gap-1 items-center text-xs md:text-sm`}>
                                    Next
                                    <ArrowRight className="w-3 md:w-4 "/>
                              </button>
                        </div>
                  </div>
            </div>
      );
}
