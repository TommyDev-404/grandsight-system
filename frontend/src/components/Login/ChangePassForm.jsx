import { useState } from "react";
import Modal from "./Modal.jsx";
import { Loader2Icon } from "lucide-react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useAuthModal } from "../../context/LoginContext.jsx";
import { useMessageCard } from "../../context/MessageCardContext.jsx";
import { useChangePassword } from '../../hooks/authQueries.js';

export default function ChangePassForm() {
      const { switchView } = useAuthModal();
      const { showMessage } = useMessageCard();

      const [showPassword, setShowPassword] = useState(false);
      const [password, setPassword] = useState("");
      const [confirm, setConfirm] = useState("");

      const { mutate: changePassword, isPending } = useChangePassword({ showMessage, switchView });

      const handleSubmit = (e) => {
            e.preventDefault();

            if (password !== confirm) {
                  showMessage({ status: 'failed', message: "Passwords do not match" });
                  return;
            }

            changePassword(password);
      };

      return (
            <Modal title={'Update Password'} description={"Create a new secure password"}>
                  <form onSubmit={handleSubmit} className="space-y-4">
                        {/* New password */}
                        <div className="relative">
                              <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full rounded-lg border border-stone-300 md:p-4 p-3 text-xs md:text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                              />

                        </div>

                        {/* Confirm password */}
                        <input
                              type={showPassword ? "text" : "password"}
                              placeholder="Confirm password"
                              value={confirm}
                              onChange={(e) => setConfirm(e.target.value)}
                              required
                              className="w-full rounded-lg border border-stone-300 md:p-4 p-3 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        />

                        <div className="-mt-2 mb-8">
                              <input type="checkbox" id="showPassword" checked={showPassword} onChange={() => setShowPassword(!showPassword)} className="mr-2"/>
                              <label htmlFor="showPassword" className="text-stone-200 text-xs md:text-sm">Show password</label>
                        </div>

                        <button type="submit" disabled={isPending}  className={`w-full ${isPending ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-500'} text-white rounded-lg p-2.5 md:py-3 text-xs md:text-sm transition flex justify-center gap-1 items-center`}>
                              { isPending ?
                                    <>
                                          <Loader2Icon className="w-4 h-4 animate-spin text-white"/>
                                          Updating...
                                    </>
                              : 
                                    "Update password"
                              }
                        </button>

                        </form>

                        {/* Footer */}
                        <div className="mt-6 text-center text-sm">
                              <span className="text-stone-200 text-xs md:text-sm">Remember password?</span>{" "}
                              <button onClick={() => switchView("login")} className="text-white underline  text-xs md:text-sm">
                                    Sign in
                              </button>
                        </div>

            </Modal>
      );
}
