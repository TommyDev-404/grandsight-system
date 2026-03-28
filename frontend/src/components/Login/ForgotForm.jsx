import { useState } from "react";
import Modal from "./Modal";
import { ArrowRight, Loader2Icon } from "lucide-react";
import { useAuthModal } from "../../context/LoginContext";
import { useMessageCard } from "../../context/MessageCardContext";
import { useCodeVerification, useEmailVerification } from "../../hooks/authQueries";

export default function ForgotForm() {
      const { switchView } = useAuthModal();
      const { showMessage } = useMessageCard();

      const [email, setEmail] = useState("");
      const [code, setCode] = useState("");
      const [step, setStep] = useState("email"); // email | code
      
      const { mutate: verifyEmail, isPending: verifyEmailLoading } = useEmailVerification({ showMessage, setStep });
      const { mutate: verifyCode, isPending: verifyCodeLoading } = useCodeVerification({ showMessage, switchView });
      
      const handleSendEmail = async () => {
            verifyEmail(email);
      };

      const handleVerifyCode = async () => {
            verifyCode(code);
      };

      return (
            <Modal title={'Forgot Password'} description={"We'll help you recover your account"}>

                  {/* EMAIL STEP */}
                  {step === "email" && (
                        <div className="space-y-4">
                              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-stone-300 p-3 md:p-4 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                              <button onClick={handleSendEmail} disabled={verifyEmailLoading} className={`w-full ${verifyCodeLoading ? 'bg-blue-900' : 'bg-blue-600 hover:bg-blue-500'} text-white rounded-lg p-2.5 md:py-3 text-xs md:text-sm transition flex justify-center gap-1 items-center`}>
                                    {verifyEmailLoading ? 
                                          <>
                                                <Loader2Icon className="w-4 h-4 animate-spin text-white"/>  
                                                Sending...
                                          </>
                                    : "Send verification code"}
                              </button>
                        </div>
                  )}

                  {/* CODE STEP */}
                  {step === "code" && (
                  <div className="space-y-4">

                        <input type="text" placeholder="Enter 6-digit code" value={code} onChange={(e) => setCode(e.target.value)} className="w-full rounded-lg border border-stone-300 p-3 md:p-4 text-xs md:text-sm tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-blue-500"/>

                        <button onClick={handleVerifyCode} disabled={verifyCodeLoading} className={`w-full ${verifyCodeLoading ? 'bg-blue-900' : 'bg-blue-600 hover:bg-blue-500'} text-white rounded-lg p-2.5 md:py-3 text-xs md:text-sm flex items-center justify-center gap-2 transition`}>
                              {verifyCodeLoading ? 
                                    <>
                                          <Loader2Icon className="w-4 h-4 animate-spin text-white"/>
                                          Verifying code...
                                    </>
                              : 
                                    <>
                                          Continue
                                          <ArrowRight size={16} />
                                    </>
                              }
                        </button>
                  </div>
                  )}

                  {/* Footer */}
                  <div className="mt-6 text-center text-sm">
                        <span className="text-stone-600 text-xs md:text-sm">Remember password?</span>{" "}
                        <button onClick={() => switchView("login")} className="text-blue-600 hover:underline  text-xs md:text-sm">
                              Sign in
                        </button>
                  </div>

            </Modal>
      );
}
