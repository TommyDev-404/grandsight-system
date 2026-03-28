import { useState } from "react";
import { useMessageCard } from "../../context/MessageCardContext";
import { useVerifyCodeForPasswordUpdating } from "../../hooks/adminProfileQueries";
import { CheckCircle2Icon, Loader2Icon } from "lucide-react";
import Button from "../../shared/Button";
import ModalWrapper from "../modals/ModalWrapper";

export default function InputCodeModal({ closeModal }){
      const { showMessage } = useMessageCard();
      const [ code, setCode ] = useState('');

      const { mutate: codeVerification, isPending } = useVerifyCodeForPasswordUpdating({ showMessage, closeModal });

      const handleCodeVerification = async() => {
            codeVerification(code);
      };

      return (
            <ModalWrapper 
                  modalTitle={`Confirmation Code`}
                  modalTitleDescription={`Enter the code sent to confirm its you.`}
                  className={'md:w-[25%]'}
                  closeModal={closeModal}
            >
                  <div className="p-3 md:p-4 flex flex-col">
                        <input  type="text" inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value)}  className="text-sm w-full p-4 mb-4 border border-stone-300 rounded-lg text-stone-900 dark:text-white dark:bg-stone-900" placeholder={`Enter 6-digit code`}/> 

                        <Button 
                              icon={isPending ? <Loader2Icon className="w-4 h-4 animate-spin text-white" /> : <CheckCircle2Icon className="w-3 md:w-4" />}
                              text={isPending ? 'Verifying...' : 'Submit'} 
                              type={'button'} 
                              clickEvent={handleCodeVerification}
                              className={'text-xs md:text-sm mt-0 md:mt-2 p-2 md:p-3'}
                        />
                  </div>
            </ModalWrapper>
      );
}