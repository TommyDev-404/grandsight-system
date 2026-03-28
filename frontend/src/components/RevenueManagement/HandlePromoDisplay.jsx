
import { useModal } from "../../context/ModalContext";
import ModalWrapper from "../modals/ModalWrapper";
import PromoModal from "./PromoModal";

export default function HandlePromoDisplay({ status=null, setEditModal=null, isEditModal}){
      const { closeModal } = useModal();
      return (
            <>
                  {status ? 
                        <ModalWrapper 
                              modalTitle={isEditModal || isEditModal === 'enable' ? 'Edit Promotion' : 'Add Promotion'} 
                              modalTitleDescription={isEditModal || isEditModal === 'enable' ? 'Update current promotion details below.' : 'Add new promotion details below.' } 
                              closeModal={closeModal} 
                        >
                              <PromoModal isEditModal={isEditModal} setEditModal={setEditModal}/>
                        </ModalWrapper> 
                  :
                        <PromoModal isEditModal={isEditModal} setEditModal={setEditModal} customClassName="w-[90%] md:max-w-3xl bg-white dark:bg-stone-900 rounded-2xl shadow-lg p-2  border border-white/20 relative"/>
                  }
            </>
      );
}