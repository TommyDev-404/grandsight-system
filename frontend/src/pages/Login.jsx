import AuthModalSwitcher from "../components/Login/AuthenticationSwitcher";
import { AuthModalProvider } from "../context/LoginContext";

export default function Login(){
      return (
            <AuthModalProvider>
                  <AuthModalSwitcher/>
            </AuthModalProvider>
      );
}