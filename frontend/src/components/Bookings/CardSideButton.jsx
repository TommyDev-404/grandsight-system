import { useModal } from "../../context/ModalContext";

export default function CardSideButton({ title, icon, iconBg, colSpan, children,  modalTitle, modalIcon, count}){
      const { openModal } = useModal();

      const handleModalOpen = () => {
            openModal({
                  name: 'upcoming',
                  title: modalTitle,
                  icon: modalIcon
            });
      };

      return (
            <div className={`${colSpan} p-4 md:p-5  bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 transform hover:scale-103 flex flex-col justify-between`} >
                  <div className="flex justify-between items-center">
                        <p className="text-xs md:text-[16px]  font-semibold text-gray-600 dark:text-gray-300 flex justify-between items-center gap-2 ">
                              <span className={`${iconBg} p-2 rounded-full`}>{icon}</span>
                              {title}
                        </p>
                        <button onClick={handleModalOpen} className="relative text-[12px] md:text-xs bg-stone-200 font-medium rounded-sm py-1.5 px-2  md:py-2 md:px-3 dark:text-white dark:bg-stone-700 transition-all active:scale-95">
                              Upcoming
                              {count !== 0 && 
                                    <span className="absolute -top-1 -right-1.5 min-w-4.5 h-4.5 px-1 text-[10px] flex items-center justify-center bg-red-500 text-white rounded-full">
                                          {count}
                                    </span>
                              }
                        </button>
                  </div>
                  {children}
            </div>
      );
}