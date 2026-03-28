import { useState, useEffect } from "react";
import { CheckCircle, EditIcon, Loader2Icon, Percent } from "lucide-react"; // Using Lucide icon for percentage
import { useModal } from "../../context/ModalContext";
import { useMessageCard } from "../../context/MessageCardContext";
import { useGetAllResortArea } from "../../hooks/analyticsQueries";
import { useAddPromo, useUpdatePromo } from "../../hooks/revenueMgmtQueries";
import { capitalizeWords } from '../../shared/helper';
import Button from "../../shared/Button";

export default function PromoModal({ setEditModal, isEditModal, customClassName='' }) {
      const EMPTY_FORM = {
            promo_name: '',
            promo_rate: '',
            start: '',
            end: ''
      };
      
      const { closeModal, modal } = useModal();
      const { showMessage } = useMessageCard();
      const data = modal.payload;
      
      const [formData, setFormData] = useState(EMPTY_FORM);
      const [selectedAreas, setSelectedAreas] = useState([]);

      const { data: allAreaData, isLoading } = useGetAllResortArea();
      const areas = allAreaData?.data || [];
      
      const resetForm = () => {
            setFormData({
                  promo_name: '',
                  promo_rate: '',
                  start: '',
                  end: '',
                  areas_promo: ''
            });
            setSelectedAreas([]);
            if (setEditModal) setEditModal(false);
            closeModal();
      };

      const { mutate: addPromo, isPending: addPromoLoading } = useAddPromo({ showMessage, resetForm });
      const { mutate: updatePromo, isPending: updatePromoLoading } = useUpdatePromo({ showMessage, resetForm });
      
      // Trigger edit or add modal in desktop mode
      useEffect(() => {
            // when not edit reset the form - desktop mode only
            if (!isEditModal) {
                  setFormData(EMPTY_FORM);
                  setSelectedAreas([]);
                  return;
            }

            if (!data) return;

            // when edit icon click, fill the form - desktop mode only
            setFormData({
                  promo_name: data.name?.split('-')[0] ?? '',
                  promo_rate: data.discount ?? '',
                  start: new Date(data.start_date).toISOString().split('T')[0],
                  end: new Date(data.end_date).toISOString().split('T')[0]
            });
            
            // fill the area that is under promo
            setSelectedAreas( data.area ? data.area.split(',').map(a => a.trim()) : [] );
      
      }, [isEditModal]);
      
      const handleAreaToggle = (area) => {
            setSelectedAreas((prev) =>
                  prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
            );
      };
      
      const handleSelectAll = () => {
            setSelectedAreas(selectedAreas.length === areas.length ? [] : areas.map(area => area.area_name));
      };

      const handleSubmit = async (e) => {
            e.preventDefault();
            
            const payload = { ...formData, areas_promo: selectedAreas.join(',') };
            
            if (isEditModal) {
                  payload.id = data.id;
                  payload.prev_area = data.area;
            }
            console.log(payload);
            isEditModal ? updatePromo(payload) : addPromo(payload);
      };

      return (
            <div className={customClassName}>
                  {/* Header */}
                  <div className="hidden md:flex items-center justify-center gap-3 mb-3">
                        {isEditModal ? <EditIcon className="md:w-6 md:h-6 w-5 h-5 text-yellow-500"/> : <Percent className="md:w-6 md:h-6 w-5 h-5 text-green-500" /> }
                        <h3 className="text-[20px] md:text-2xl font-semibold text-gray-900 dark:text-white">{isEditModal || isEditModal === 'enable' ? 'Edit Promotion' : 'Add Promotion' }</h3>
                  </div>

                  <form className="flex flex-col md:p-2 px-3 pb-3 gap-3" onSubmit={handleSubmit}>
                        <div className="h-75 md:h-auto overflow-y-auto pt-2 md:p-3  scrollbar-hide">
                              {/* Promotion Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                          <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Promotion Name</label>
                                          <input type="text" value={formData.promo_name} onChange={(e) => setFormData({ ...formData, promo_name: capitalizeWords(e.target.value) })} style={{ textTransform: 'capitalize' }} required className="text-sm md:text-base mt-2 w-full rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 overflow-visible  dark:bg-stone-800 text-stone-900 dark:text-white p-3 focus:ring-blue-500 focus:border-blue-500 transition"/>
                                    </div>

                                    <div>
                                          <label className="block text-xs md:text-sm font-medium text-stone-700 dark:text-stone-300">Discount Rate (%)</label>
                                          <input type="number" value={formData.promo_rate} onChange={(e) => setFormData({ ...formData, promo_rate: e.target.value })} required className="text-sm md:text-base mt-2 w-full rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white p-3 focus:ring-blue-500 focus:border-blue-500 transition"/>
                                    </div>

                                    <div>
                                          <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
                                          <input type="date" value={formData.start} onChange={(e) => setFormData({ ...formData, start: e.target.value })} required className="text-sm md:text-base mt-2 w-full rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white p-3 focus:ring-blue-500 focus:border-blue-500 transition"/>
                                    </div>

                                    <div>
                                          <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
                                          <input type="date" value={formData.end} onChange={(e) => setFormData({ ...formData, end: e.target.value })} required className="text-sm md:text-base mt-2 w-full rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white p-3 focus:ring-blue-500 focus:border-blue-500 transition"/>
                                    </div>
                              </div>

                              {/* Areas */}
                              <div className="bg-stone-50 dark:bg-stone-800 p-3 md:p-5 rounded-xl border border-stone-200 dark:border-stone-700 mt-5">
                                    <div className="flex justify-between items-center mb-4 relative">
                                          <h4 className="font-semibold text-sm md:text-lg text-gray-900 dark:text-white whitespace-nowrap">Areas to Apply Promotion</h4>
                                          <label className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap cursor-pointer text-gray-700 dark:text-gray-300 absolute md:relative right-0 top-9 md:top-0">
                                          <input type="checkbox" checked={selectedAreas.length === areas.length} onChange={handleSelectAll} className="w-4 h-4"/>Select All</label>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 mt-12 md:mt-0 h-70 overflow-y-auto scrollbar-hide">
                                          {areas.map((area) => (
                                                <label key={area.area_name}
                                                      className={`flex items-center text-xs md:text-sm gap-2 p-3 rounded-lg border border-stone-200 dark:border-stone-700 transition cursor-pointer whitespace-nowrap
                                                      ${
                                                      selectedAreas.includes(area.area_name)
                                                      ? "bg-blue-100 dark:bg-blue-800 border-blue-400"
                                                      : "bg-white dark:bg-stone-900 hover:bg-blue-200 dark:hover:bg-stone-700"
                                                      } text-stone-900 dark:text-white`}
                                                >
                                                      <input
                                                            type="checkbox"
                                                            checked={selectedAreas.includes(area.area_name)}
                                                            onChange={() => handleAreaToggle(area.area_name)}
                                                            className="w-4 h-4"
                                                      />
                                                      {area.area_name}
                                                </label>
                                          ))}
                                    </div>
                              </div>
                        </div>

                        {/* Buttons Desktop */}
                        <div className="hidden md:flex justify-end items-center gap-3 mr-2">
                              <button type="button" onClick={resetForm} className="hidden md:block px-5 py-3 rounded-lg text-sm bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 transition">{isEditModal ? 'Cancel Editing' : 'Cancel'}</button>
                              <Button 
                                    icon={addPromoLoading || updatePromoLoading ? <Loader2Icon className="w-4 h-4 animate-spin text-white" /> : <CheckCircle className="w-3 md:w-4" />}
                                    text={addPromoLoading || updatePromoLoading ? 'Saving...' : 'Save Promotion'} 
                                    type={'submit'}
                                    disable={addPromoLoading || updatePromoLoading ? true : false}
                                    className={'p-2.5 md:p-3 w-50'}
                              />
                        </div>
                        
                        {/* Buttons MObile */}
                        <div className="flex md:hidden">
                              <Button 
                                    icon={addPromoLoading || updatePromoLoading ? <Loader2Icon className="w-4 h-4 animate-spin text-white" /> : <CheckCircle className="w-3 md:w-4" />}
                                    text={addPromoLoading || updatePromoLoading ? 'Saving...' : 'Save Promotion'} 
                                    type={'submit'} 
                                    disable={addPromoLoading || updatePromoLoading ? true : false}
                                    className={'p-2.5 md:p-3 w-full text-xs'}
                              />
                        </div>
                  </form>
            </div>
      );
}
