import LoginForm from "./LoginForm";
import ForgotForm from "./ForgotForm";
import ChangePassForm from "./ChangePassForm";
import { useAuthModal } from "../../context/LoginContext";

export default function AuthModalSwitcher(){
      const { view } = useAuthModal();

      return (
            <div className="" >
                  {view === 'login' ? <LoginForm/> : view === 'forgot' ? <ForgotForm/> : <ChangePassForm/>}
            </div>
      );
}