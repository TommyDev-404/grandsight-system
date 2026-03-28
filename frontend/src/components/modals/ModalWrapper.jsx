import { useState } from "react";

export default function ModalWrapper({ children, className, closeModal, modalTitle, modalTitleDescription, icon, bgColor, enableModal=true }) {
      const [isClosing, setIsClosing] = useState(false);

      const handleSmoothCloseModal = () => {
            setIsClosing(true);

            setTimeout(() => {
                  closeModal();
                  setIsClosing(false);
            }, 200);
      };

      return (
            <div className={`absolute inset-0 flex items-center justify-center z-50 ${isClosing ? "overlay-fade-out" : "overlay-fade-in"} `}>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50" />

                  {enableModal &&
                        <div  className={`relative bg-white dark:bg-stone-900 rounded-lg shadow-2xl w-[95%] flex flex-col ${className} ${isClosing ? "modal-fade-out" : "modal-fade-in"}`}>
                              <div className={`flex justify-between items-center ${bgColor} border-b border-stone-200 dark:border-stone-700 p-3 md:px-4 md:py-3`}>
                                    <div className="flex gap-1.5 md:gap-3 items-center">
                                          {icon}
                                          <div className="flex flex-col">
                                                <h2 className="text-[17px] md:text-xl font-bold text-gray-700 dark:text-stone-200">{modalTitle}</h2>
                                                <span className="text-[12px] md:text-xs text-gray-400 -mt-0.5 md:mt-0">{modalTitleDescription}</span>
                                          </div>
                                    </div>

                                    <button onClick={handleSmoothCloseModal} className="text-gray-500 hover:text-red-500 text-2xl -mt-5">&times;</button>
                              </div>

                              {children}
                        </div>
                  }

                  {!enableModal &&
                        <>
                              {children}
                        </>
                  }
            </div>
      );
}
