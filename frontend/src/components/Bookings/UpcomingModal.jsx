import UpcomingTable from "../../shared/UpcomingTable";
import ModalWrapper from "../modals/ModalWrapper";

export default function UpcomingModal({title, closeModal }){
      return (
            <ModalWrapper modalTitle={title} modalTitleDescription={'View upcoming bookings below with accuracy.'}  closeModal={closeModal} className={'md:w-[60%]'}>
                  <UpcomingTable title={title} componentUsed={'booking'} className={'flex flex-col gap-2 p-3 md:px-4 md:py-2'}/>
            </ModalWrapper>
      );
}