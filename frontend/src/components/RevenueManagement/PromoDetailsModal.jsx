import { useModal } from "../../context/ModalContext";
import ModalWrapper from "../modals/ModalWrapper";

export default function PromoDetailsModal({ closeModal}) {
      const { modal } = useModal();
      const data = modal.payload.data;
      const areas = modal.payload.area;

      return (
            <ModalWrapper 
                  modalTitle={`${data.name} Details`} 
                  modalTitleDescription={`View promotion information overview`}
                  closeModal={closeModal}
                  className={'md:w-[50%]'}
            >
                  {/* Body */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm md:h-auto h-70 overflow-y-auto scrollbar-hide">
                        {/* Promo Info */}
                        <div className="space-y-4">
                              <div>
                                    <p className="text-xs uppercase tracking-wide text-stone-500 dark:text-gray-400 mb-1">Promo Name</p>
                                    <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 font-medium text-stone-900 dark:text-white">{data.name}</div>
                              </div>
                  
                              <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Discount (%)</p>
                                    <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 font-medium text-gray-900 dark:text-white">{data.discount}</div>
                              </div>
                        </div>
            
                        {/* Schedule Info */}
                        <div className="space-y-4">
                              <div>
                                    <p className="text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-1">Started</p>
                                    <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-900 dark:text-white">{new Date(data.start_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric'})}</div>
                              </div>
                  
                              <div>
                                    <p className="text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-1">End</p>
                                    <div className="bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-900 dark:text-white">{new Date(data.end_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric'})}</div>
                              </div>
                        </div>
            
                        {/* Status */}
                        <div className="md:col-span-2 space-y-2">
                              <h3 className="text-xs uppercase tracking-wide text-stone-600 dark:text-stone-400">Status</h3>
                              <div className="max-h-28 overflow-y-auto bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-900 dark:text-white">{data.status}</div>
                        </div>
            
                        {/* Area Applied */}
                        <div className="md:col-span-2 space-y-2">
                              <h3 className="text-xs uppercase tracking-wide text-stone-600 dark:text-stone-400">Area Applied</h3>
                              <div className="max-h-28 overflow-y-auto bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-900 dark:text-white">
                                    {
                                          (() => {
                                                const selected = data.area?.split(',').map(a => a.trim()) || [];
                                                const all = areas.map(a => a.complete_name);
                                                
                                                return all.every(a => selected.includes(a)) ? "All Areas" : selected.join(', ');
                                          })()
                                    }
                              </div>
                        </div>
                  </div>
            </ModalWrapper>
      );
}
