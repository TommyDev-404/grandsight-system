import ReactDOM from "react-dom";
import { lazy, Suspense } from "react";
import { useModal } from "../../context/ModalContext.jsx";
import { OverlaySpinner } from '../../shared/LoadingSpinner.jsx'

const UpcomingModal = lazy(() => import("../Bookings/UpcomingModal.jsx"));
const AddBookingModal = lazy(() => import("../Bookings/AddBookingModal.jsx"));
const ViewGuestDetailsModal = lazy(() => import("../Bookings/ViewGuestInfoModal.jsx"));
const MarkPaidModal = lazy(() => import("../Bookings/MarkPaidModal.jsx"));
const ChangeSchedModal = lazy(() => import("../Bookings/ChangeSchedModal.jsx"));
const ViewRoomsModal = lazy(() => import("../Housekeeping/ViewRoomModal.jsx"));
const PromoDetailsModal = lazy(() => import("../RevenueManagement/PromoDetailsModal.jsx"));
const HandlePromoDisplay = lazy(() => import("../RevenueManagement/HandlePromoDisplay.jsx"));
const AddAttendanceModal = lazy(() => import("../StaffManagement/AddAttendance.jsx"));
const SetTimeOutModal = lazy(() => import("../StaffManagement/SetTimeOutModal.jsx"));
const OnLeaveModal = lazy(() => import("../StaffManagement/OnLeaveModal.jsx"));
const ViewStaffDetails = lazy(() => import("../StaffManagement/ViewStaffDetails.jsx"));
const EditProfileDataModal = lazy(() => import("../AdminProfile/EditModal.jsx"));
const InputCodeModal = lazy(() => import("../AdminProfile/CodeInputModal.jsx"));
const AreaModal = lazy(() => import("../Rates&Availability/AreaModal.jsx"));
const StaffModal = lazy(() => import("../StaffManagement/StaffModal.jsx"));
const ConfirmationModal = lazy(() => import("../../shared/ConfirmationModal.jsx"));


export default function ModalDisplayer() {
      const { modal, closeModal } = useModal();

      const modals = {
            "upcoming": <UpcomingModal closeModal={closeModal} title={modal.title} icon={modal.icon} />,
            "add booking": <AddBookingModal closeModal={closeModal} />,
            "view guest details": <ViewGuestDetailsModal closeModal={closeModal} data={modal.payload?.data} />,
            "mark paid": <MarkPaidModal closeModal={closeModal}  data={modal.payload?.data}  clearSelection={modal.payload?.clearSelection}/>,
            "change schedule": <ChangeSchedModal closeModal={closeModal} data={modal.payload?.data} clearSelection={modal.payload?.clearSelection}/>,
            "view rooms": <ViewRoomsModal closeModal={closeModal} areaName={modal.areaSelected}  />,
            "add promo": <HandlePromoDisplay status="mobile" />,
            "edit promo": <HandlePromoDisplay isEditModal="enable" status="mobile"/>,
            "view promo details": <PromoDetailsModal closeModal={closeModal} />,
            "add staff": <StaffModal closeModal={closeModal} modalType={'Add'} />,
            "update staff": <StaffModal closeModal={closeModal} modalType={'Update'} staff={modal.payload}/>,
            "add attendance": <AddAttendanceModal closeModal={closeModal} date={modal.payload}/>,
            "set timeout": <SetTimeOutModal closeModal={closeModal} date={modal.payload}/>,
            "on-leave": <OnLeaveModal closeModal={closeModal} />,
            "view staff details": <ViewStaffDetails closeModal={closeModal} staff={modal.payload} />,
            "edit username": <EditProfileDataModal closeModal={closeModal} modalType={modal.type}  data={modal.payload} />,
            "edit email": <EditProfileDataModal closeModal={closeModal} modalType={modal.type} data={modal.payload}/>,
            "edit number": <EditProfileDataModal closeModal={closeModal} modalType={modal.type}  data={modal.payload}/>,
            "edit theme": <EditProfileDataModal closeModal={closeModal} modalType={modal.type} />,
            "input code" : <InputCodeModal closeModal={closeModal}/>,
            "add area": <AreaModal closeModal={closeModal} modalType={'Add'} description={'Fill-in area informations and details below.'} />,
            "edit area": <AreaModal closeModal={closeModal} modalType={'Edit'} description={'Update  area informations and details below.'} data={modal.payload}/>,
            "confirm logout": <ConfirmationModal message={modal.payload?.message} buttonNameIdle={modal.payload?.buttonNameIdle} buttonNameLoading={modal.payload?.buttonNameLoading} clickEvent={modal.payload?.clickEvent} closeModal={closeModal}/>,
            "login loading": <ConfirmationModal buttonNameLoading={modal.payload?.buttonNameLoading} isLoading={true} closeModal={closeModal}/>,
            "confirm remove area": <ConfirmationModal message={modal.payload?.message} buttonNameIdle={modal.payload?.buttonNameIdle} subject={modal.payload?.areaToRemove} clickEvent={modal.payload?.clickEvent} closeModal={closeModal}/>,
            "confirm remove promo": <ConfirmationModal message={modal.payload?.message} buttonNameIdle={modal.payload?.buttonNameIdle} subject={modal.payload?.subject} clickEvent={modal.payload?.clickEvent} closeModal={closeModal}/>,
            "confirm remove staff": <ConfirmationModal message={modal.payload?.message} buttonNameIdle={modal.payload?.buttonNameIdle} subject={modal.payload?.subject} clickEvent={modal.payload?.clickEvent} closeModal={closeModal}/>,
      };

      return ReactDOM.createPortal(
            <Suspense fallback={ !['login loading'].includes(modal.name) ? <OverlaySpinner/> : null }>
                  {modals[modal.name] || null}
            </Suspense>,
            document.getElementById("portal-root")
      );
}
