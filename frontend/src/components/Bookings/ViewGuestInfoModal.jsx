import ModalWrapper from "../modals/ModalWrapper";

export default function ViewGuestDetailsModal({ closeModal, data }){
      
      return (    
            <ModalWrapper 
                  modalTitle={data?.name ?? "--"} 
                  modalTitleDescription={
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                              {data?.booking_type  ?? "--"} ·{" "}
                              <span className={
                                          data?.status  === "Cancelled"
                                          ? "text-red-600 dark:text-red-400"
                                          : data?.status === "Checked-in"
                                          ? "text-blue-600 dark:text-blue-400"
                                          : data?.status === "Checked-out"
                                          ? "text-orange-600 dark:text-orange-400"
                                          : "text-green-600 dark:text-green-400"
                              }>
                                    {data?.status  ?? "--"}
                              </span>
                        </p>
                  } 
                  icon={<div className="md:w-12 md:h-12 w-8 h-8 text-sm rounded-full bg-blue-200 text-white flex items-center justify-center md:text-xl shadow">👤</div>}
                  bgColor={'bg-stone-200 dark:bg-stone-700'}
                  closeModal={closeModal} 
                  className={'overflow-hidden h-auto md:w-[60%]'}
            >
                  {/* CONTENT GRID */}
                  <div className="p-3 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm h-96 overflow-y-auto md:h-auto scrollbar-hide">
                        {/* GUEST INFO */}
                        <div className="rounded-xl border border-blue-200 dark:border-blue-800 p-4 space-y-3">
                              <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-300">Guest Information</h3>
                  
                              <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Total Guests</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{data?.total_guest  ?? "--"}</span>
                              </div>
                  
                              <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Booking Type</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">Room Stay</span>
                              </div>
                        </div>                           
            
                        {/* SCHEDULE */}
                        <div className="rounded-xl border border-indigo-200 dark:border-indigo-800 p-4 space-y-3">
                              <h3 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Schedule</h3>
                  
                              <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Date Book</span>
                                    <span className="text-gray-900 dark:text-gray-100">{new Date(data?.date_book).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric'})}</span>
                              </div>
                  
                              <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Check-in</span>
                                    <span className="text-gray-900 dark:text-gray-100">{new Date(data?.check_in).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric'})}</span>
                              </div>
                  
                              <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Check-out</span>
                                    <span className="text-gray-900 dark:text-gray-100">{new Date(data?.check_out).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric'})}</span>
                              </div>
                        </div>
            
                        {/* PAYMENT */}
                        <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 p-4 space-y-3">
                              <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Payment</h3>
                  
                              <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Date Paid</span>
                                    <span className="text-gray-900 dark:text-gray-100">{data?.date_paid !== null ? new Date(data?.date_paid).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric'}) : "--"}</span>
                              </div>
                  
                              <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Payment Method</span>
                                    <span className={`font-medium ${data?.payment !== 'Pending' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'} `}>{data?.payment  ?? "--"}</span>
                              </div>
                  
                              <div className="flex justify-between font-semibold">
                                    <span className="text-gray-700 dark:text-gray-300">{!['Pending', 'None'].includes(data?.payment) ? 'Total Amount Paid (₱)' : 'Total Amount To Be Paid (₱)'}</span>
                                    <span className="text-emerald-600 dark:text-emerald-400">{data?.amount  ?? "--"}</span>
                              </div>
                        </div>
            
                        {/* PROMO */}
                        <div className="rounded-xl border border-purple-200 dark:border-purple-800 p-4 space-y-3">
                              <h3 className="text-sm font-semibold text-purple-700 dark:text-purple-300">Promo Details</h3>
                  
                              <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Promo Name</p>
                                    <p className="text-gray-900 dark:text-gray-100">{data?.promo ?? "--"}</p>
                              </div>
                  
                              <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Area Affected</p>
                                    <p className="text-gray-900 dark:text-gray-100">{data?.area_under_promo}</p>
                              </div>
                        </div>
            
                        {/* ACCOMMODATIONS */}
                        <div className="md:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-2">
                              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Accommodations</h3>
                  
                              <div className="max-h-32 overflow-y-auto text-gray-900 dark:text-gray-100">{data?.accomodations  ?? "--"}</div>
                        </div>
            
                  </div>
            </ModalWrapper>
      );
}
