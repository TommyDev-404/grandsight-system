import { useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useMessageCard } from "../../context/MessageCardContext";
import { useAuthModal } from "../../context/LoginContext";
import { useLogin } from "../../hooks/authQueries";
import { useModal } from "../../context/ModalContext";
import { Loader2Icon } from "lucide-react";
import Modal from "./Modal";


export default function LoginForm() {
      const { showMessage } = useMessageCard();
      const { switchView } = useAuthModal();
      const { openModal } = useModal();

      const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
      const [showPassword, setShowPassword] = useState(false);
      const [loginState, setLoginState] = useState("idle");

      const { mutate: login, isPending } = useLogin({ showMessage });

      const handleLoginLoading = () => {
            openModal({
                  name: 'login loading',
                  payload: {
                        buttonNameLoading: 'Logging in...'
                  }
            });
      };

      const handleLogin = async (e) => {
            e.preventDefault();

            setLoginState('validating');
            login({ username, password }, {
                  onSuccess: (res) => {
                        if (res.data.success) {
                              setLoginState('idle');
                              handleLoginLoading();
                              localStorage.setItem('currentPage', 'Home Dashboard');
                              setTimeout(() => (window.location.href = "/admin/dashboard"), 2000);
                        }else{
                              setLoginState('idle');
                        }
                  },
            });
      };

      return (
            <Modal title={'Welcome Back'} description={'Sign in to your admin account'}>
                  {/* Form */}
                  <form onSubmit={handleLogin} className="space-y-4 flex-1">

                        <input type="text" placeholder="Username" value={username} required onChange={(e) => setUsername(e.target.value)} className="w-full rounded-lg border border-stone-300 p-3 md:p-4 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>

                        <div className="relative">
                              <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-stone-300 p-3 md:p-4 text-xs md:text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500">{showPassword ? <BsEyeSlashFill className="w-4 h-4 md:w-5 md:h-5"/> : <BsEyeFill className="w-4 h-4 md:w-5 md:h-5"/>}</button>
                        </div>

                        {/* Forgot password */}
                        <div className="text-right">
                              <button type="button" onClick={() => switchView("forgot")} className="text-[12px] md:text-xs text-blue-600 hover:underline">Forgot password?</button>
                        </div>

                        {/* Button */}
                        <button disabled={loginState !== "idle"}  className={`w-full ${isPending ? 'bg-blue-800' : 'bg-blue-600 hover:bg-blue-500'}  text-white rounded-lg py-3 text-xs md:text-sm flex justify-center items-center gap-2 transition`}>
                              {loginState === "idle" && "Sign In"}

                              {loginState === "validating" && (
                                    <>
                                          <Loader2Icon className="w-4 h-4 animate-spin text-white" />
                                          Validating...
                                    </>
                              )}
                        </button>
                  </form>

            </Modal>
      );
}
