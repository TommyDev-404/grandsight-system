import { useState, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import { useModal } from "../context/ModalContext";
import { useGlobalContext } from "../context/GlobalStorageContext";
import { usePromoList, useResortAreas, promoQueries } from "../hooks/revenueMgmtQueries";
import { useQueryClient } from "@tanstack/react-query";
import useDesktop from '../hooks/useDesktop';
import Button from "../shared/Button";
import PromoList from "../components/RevenueManagement/PromoListTable";
import LoadingSpinner from '../shared/LoadingSpinner';
import HandlePromoDisplay from "../components/RevenueManagement/HandlePromoDisplay";


export default function RevenueManagement(){
      const { openModal } = useModal();
      const isDesktop = useDesktop();
      const { setButtons, setSelectedButton } = useGlobalContext();
      const [ isEditModal, setToEditModal ] = useState(false);
      const queryClient = useQueryClient();

      const handleModalOpen = () => {
            openModal({
                  name: 'add promo'
            });
      };

      useEffect(() =>  {
            setButtons([]);
            setSelectedButton('')
      }, []);

      useEffect(() => {
            async function prefetchRatesAvailability() {
                  try {
                        await Promise.all([
                              queryClient.prefetchQuery(promoQueries.promoList()),
                              queryClient.prefetchQuery(promoQueries.resortAreas()),
                        ]);
                  } catch (error) {
                        console.error("Prefetch failed:", error);
                  }
            }

            prefetchRatesAvailability();
      }, []);

      const { data: promoList, isLoading: promoListLoading } = usePromoList();
      const { data: resortAreas, isLoading: resortAreasLoading } = useResortAreas();

      // Combine all loading states into a single pageLoading variable
      const pageLoading = promoListLoading || resortAreasLoading;
      if(pageLoading) return <LoadingSpinner/>;
      
      return (
		<section>
                  {/* Desktop View */}	
                  {isDesktop && 
                        <div className="flex gap-8 mt-5 fade-in">
                              <HandlePromoDisplay isEditModal={isEditModal} setEditModal={setToEditModal} />  {/* 3/5 of space */}

                              <div className="bg-white dark:bg-stone-900 rounded-lg shadow p-4 flex flex-col border border-stone-300 dark:border-stone-700 flex-1">
                                    <h1 className="text-stone-700 dark:text-stone-100 font-semibold text-lg mb-4 text-center border-b border-stone-300 dark:border-stone-700 pb-2">Recent Promotions Applied</h1>
                                    <PromoList setToEditModal={setToEditModal} isEditModal={isEditModal} viewType={'desktop'}/>
                              </div>
                        </div>
                  }

                  {/* Mobile View */}	
                  {!isDesktop && 
                        <div className="flex flex-col gap-5 py-2 fade-in">
                              <div className="bg-white dark:bg-stone-900 rounded-lg shadow py-2 flex flex-col border border-stone-300 dark:border-stone-700 w-full md:w-[70%] h-[calc(100vh-200px)] md:h-200 ">
                                    <h1 className="text-stone-700 dark:text-stone-100 font-semibold text-sm md:text-lg mb-4 text-center border-b border-stone-300 dark:border-stone-600 pb-2">Recent Promotions Applied</h1>
                                    <div className="h-[calc(100vh-230px)] md:h-200 overflow-y-auto px-2 -mt-4 pt-2">
                                          <PromoList viewType={'mobile'}/>
                                    </div>
                              </div>
                              
                              <div className="flex justify-end">
                                    <Button icon={<PlusIcon className="w-4 h-4"/>} text={'Add Promotion'} type={'submit'}clickEvent={handleModalOpen} className={'p-2.5 md:p-3 text-xs md:text-sm'}/>
                              </div>
                        </div>
                  }

            </section>
      );
}