import { useState } from "react";
import ModalWrapper from "../components/modals/ModalWrapper";
import Button from "./Button";
import { Loader2Icon } from "lucide-react";
import { OverlaySpinner  } from "./LoadingSpinner";

export default function ConfirmationModal({
      message=null,
      buttonNameIdle=null,
      buttonNameLoading,
      clickEvent=null,
      closeModal,
      subject=null,
      duration = 2000,
      isLoading = false
}) {
      const [loading, setLoading] = useState(isLoading);
      
      const handleClick = async () => {
            if (!clickEvent) return;
            
            if (subject) {
                  await clickEvent(subject); // run another function function
                  closeModal();
            }else{
                  setLoading(true);
                  
                  await clickEvent(); // run logout/login function

                  // optional auto-close delay
                  setTimeout(() => {
                        closeModal?.();
                  }, duration);
            }
      };

      return (
            <ModalWrapper enableModal={false}>
                  <div className="flex flex-col gap-4 md:gap-5 justify-center items-center w-auto py-5 px-7 md:px-6 md:py-6 bg-white dark:bg-stone-900 rounded-lg relative">
                        {loading && subject === null ? 
                              <OverlaySpinner message={buttonNameLoading}/>
                        :
                              <>
                                    <p className="text-stone-700 dark:text-white text-sm md:text-lg text-center">{message}</p>
                              
                                    <div className="flex items-center justify-center gap-2 md:gap-3 w-full">
                                          <button
                                                onClick={closeModal}
                                                className="px-4 py-2.5 md:px-6 md:py-2.5 rounded-lg text-stone-700 dark:text-white bg-stone-200 border border-stone-400 dark:bg-stone-800 dark:border-stone-700 hover:bg-stone-300 dark:hover:bg-stone-900 text-xs md:text-[16px]"
                                          >
                                                Cancel
                                          </button>

                                          <Button
                                                type="button"
                                                text={buttonNameIdle}
                                                clickEvent={handleClick}
                                                className="py-2.5 px-7 md:py-2.5 md:px-8 text-xs md:text-sm"
                                          />    
                                    </div>
                              </>
                        }
                        
                  </div>
            </ModalWrapper>
      );
}