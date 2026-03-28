import { useState } from "react";
import { AreaChartIcon, Building2, Edit, Loader2Icon, PlusSquare, Users2 } from "lucide-react";
import { FaPesoSign } from "react-icons/fa6";
import { useMessageCard } from '../../context/MessageCardContext';
import { capitalizeWords } from '../../shared/helper';
import { useAddArea, useUpdateArea } from "../../hooks/ratesQueries";
import ModalWrapper from "../modals/ModalWrapper";
import Button from "../../shared/Button";

export default function AreaModal({ closeModal, modalType, description, data=null }){
      const { showMessage } = useMessageCard();
      const [ formData, setFormData ] = useState({
            area_name: modalType === 'Edit' ? data.area_name : '',
            category: modalType === 'Edit' ? data.category : '',
            total_area: modalType === 'Edit' ? data.total_rooms : '',
            price: modalType === 'Edit' ? data.rate : '',
            capacity: modalType === 'Edit' ? data.capacity : '',
      });

      const { mutate: addArea, isPending: addAreaLoading } = useAddArea({ showMessage, closeModal });
      const { mutate: updateArea, isPending: updateAreaLoading } = useUpdateArea({ showMessage, closeModal });
      const isLoading = modalType === 'Edit' ? updateAreaLoading : addAreaLoading;

      const handleFormSubmission = async(e) => {
            e.preventDefault();
                        
            // Prepare the payload
            let payload = { ...formData };

            if (modalType === 'Edit') {
                  payload.prev_area_name = data.area_name;
            }

            if (modalType === 'Edit'){
                  updateArea(payload);
            }else{
                  addArea(payload);
            }
      };

      return (
            <ModalWrapper modalTitle={`${modalType} Area Info`} modalTitleDescription={description} closeModal={closeModal} className={'md:w-[40%]'}>
                  <form onSubmit={handleFormSubmission} className="flex flex-col gap-3 md:gap-4 p-3 md:px-4 md:py-3">
                        <div className="flex flex-col">
                              <label className="flex gap-1 items-center text-stone-600 text-xs md:text-sm dark:text-stone-200">
                                    <Building2 className="w-4"/>
                                    Area type or name:
                              </label>
                              <input type="text" placeholder="Enter area name" className="p-3 border border-stone-200 rounded-lg dark:border-stone-700 text-stone-800 dark:text-white text-sm md:text-[17px]" onChange={(e) => setFormData({ ...formData, area_name: capitalizeWords(e.target.value) })} style={{ textTransform: 'capitalize' }} value={formData.area_name}/>
                        </div>

                        <div className="flex flex-col">
                              <label className="flex gap-1 items-center text-stone-600 text-xs md:text-sm dark:text-stone-200">
                                    <Building2 className="w-4"/>
                                    Area Category:
                              </label>
                              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}  className={`text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-md p-3 text-sm md:text-[17px]`} >
                                    <option value="" hidden>Select Area Category</option>
                                    <option value="Room">Room</option>
                                    <option value="Cottage">Cottage</option>
                                    <option value="Hall">Hall</option>
                                    <option value="Others">Others (Please specify)</option>
                              </select>
                              
                              {formData.category === 'Others' &&
                                    <div className="mt-2 flex flex-col  fade-in">
                                          <p className="text-stone-700 dark:text-stone-400 text-xs md:text-sm">Others:</p>
                                          <input type="text" placeholder="Enter other area category" className="rounded-md border border-gray-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-sm md:text-[17px] p-3"/>
                                    </div>
                              }
                        </div>
                        
                        <div className="flex flex-col">
                              <label className="flex gap-1 items-center text-stone-600 text-xs md:text-sm dark:text-stone-200">
                                    <AreaChartIcon className="w-4"/>
                                    Total Area:
                              </label>
                              <input type="number" placeholder="Enter total area" className="p-3 border border-stone-200 rounded-lg dark:border-stone-700 text-stone-800 dark:text-white text-sm md:text-[17px]" onChange={(e) => setFormData({ ...formData, total_area: e.target.value })} value={formData.total_area}/>
                        </div>

                        <div className="flex md:flex-row flex-col gap-2 justify-between md:gap-5 ">
                              <div className="flex flex-col w-full">
                                    <label className="flex gap-1 items-center text-stone-600 text-xs md:text-sm dark:text-stone-200">
                                          <FaPesoSign className="w-4"/>
                                          Price:
                                    </label>
                                    <input type="number" placeholder="Enter price" className="p-3 border border-stone-200 rounded-lg dark:border-stone-700 text-stone-800 dark:text-white text-sm md:text-[17px]" onChange={(e) => setFormData({ ...formData, price: e.target.value })} value={formData.price}/>
                              </div>

                              <div className="flex flex-col w-full">
                                    <label className="flex gap-1 items-center text-stone-600 text-xs md:text-sm dark:text-stone-200">
                                          <Users2 className="w-4"/>
                                          Capacity
                                    </label>
                                    <input type="number" placeholder="Enter area capacity" className="p-3 border border-stone-200 rounded-lg dark:border-stone-700 text-stone-800 dark:text-white text-sm md:text-[17px]"  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} value={formData.capacity}/>
                              </div>
                        </div>
                        
                        <Button 
                              icon={
                                    isLoading
                                          ? <Loader2Icon className="w-4 h-4 animate-spin text-white" />
                                          : modalType === 'Edit'
                                          ? <Edit className="w-4" />
                                          : <PlusSquare className="w-4" />
                              }
                              text={
                                    isLoading
                                          ? modalType === 'Edit'
                                          ? "Updating..."
                                          : "Adding..."
                                          : modalType
                              }
                              type="submit"
                              disable={isLoading ? true : false}
                              className="p-2.5 md:p-3 text-xs md:text-sm transition-all duration-200"
                        />
                  </form>
            </ModalWrapper>
      );
}