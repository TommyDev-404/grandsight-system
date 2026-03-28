import { Eye, EditIcon, Trash2, Loader2Icon } from "lucide-react";
import { useModal } from "../../context/ModalContext";
import { useMessageCard } from "../../context/MessageCardContext";
import { usePromoList, useRemovePromo } from "../../hooks/revenueMgmtQueries";
import { useGetAllResortArea } from "../../hooks/analyticsQueries";

export default function PromoList({ setToEditModal, viewType}) {
      const { openModal } = useModal();
      const { showMessage } = useMessageCard();

      const { data: promoData, isLoading: promoDataLoading } = usePromoList();
      const promo = promoData?.data || [];

      const { data: allAreaData, isLoading } = useGetAllResortArea();
      const areas = allAreaData?.data || [];

      const { mutate: removePromo, isPending } = useRemovePromo({ showMessage });

      const handleModalOpen = (modalName, payload) => {
            viewType !== 'mobile' && modalName !== 'edit promo' && setToEditModal(false);
            openModal({
                  name: modalName,
                  payload : modalName === 'edit promo' ? payload : { data: payload, area: areas } 
            });
      };

      const handleEditDesktop = (payload) => {
            setToEditModal(true);
            openModal({ payload : payload });
      };

      const handleRemoveConfirmation = (id, areas) =>  {
            openModal({
                  name: 'confirm remove promo',
                  payload: {
                        message: 'Are you sure you want to remove this promo?',
                        buttonNameIdle: 'Remove',
                        buttonNameLoading: 'Removing...',
                        subject: { id: id, areas: areas },
                        clickEvent: removePromo
                  }
            });
      };
      
      return (
            <ul className="space-y-4 px-1 md:px-4">
                  {promo.length > 0 ? 
                        promo.map((promo) => (
                              <li key={promo.id} className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 shadow-md flex md:flex-row flex-col justify-between transition-all duration-200 ease-in-out hover:scale-[1.01]">
                                    {/* Promo Info */}
                                    <div>
                                          <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm md:text-lg text-gray-900 dark:text-gray-100">{promo.name}</span>
                                          </div>
                                          <div className="text-[12px] md:text-sm text-gray-500 dark:text-gray-400">{new Date(promo.start_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric'})} - {new Date(promo.end_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric'})}</div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-around gap-4 md:gap-1 mt-2 md:mt-0">
                                          <button onClick={() => handleModalOpen('view promo details', promo)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-gray-700 rounded-lg">
                                                <Eye className="w-5 h-5 md:w-6 md:h-6" />
                                          </button>

                                          <button onClick={viewType === 'desktop' ? () => handleEditDesktop(promo) : () => handleModalOpen('edit promo', promo)} className="p-2 text-yellow-500 hover:bg-yellow-100 dark:hover:bg-gray-700 rounded-lg">
                                                <EditIcon  className="w-5 h-5 md:w-6 md:h-6" />
                                          </button>

                                          <button onClick={() => handleRemoveConfirmation(promo.id, promo.area)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-gray-700 rounded-lg">
                                                {isPending ?
                                                      <Loader2Icon className="w-4 h-4 md:w-5 md:h-5 animate-spin text-red-500"/>
                                                :
                                                      <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                                                }
                                          </button>
                                    </div>
                              </li>
                        ))
                  :
                        <li  className="p-6 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 shadow-md flex  justify-center transition-all duration-200 ease-in-out hover:scale-[1.01]">
                              <p className="text-xs md:text-sm text-center text-stone-700 dark:text-stone-200"> No recent promo.</p>
                        </li>
                  }
            </ul>
      );
}
