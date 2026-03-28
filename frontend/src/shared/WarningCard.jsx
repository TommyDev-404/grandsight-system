import { AlertTriangle } from "lucide-react";
import ModalWrapper from "../components/modals/ModalWrapper";
import { useTheme } from "../context/ThemeContext";

export default function WarningCard({ message, setModalOpen }) {
      const { theme } = useTheme();
      
      return (
            <ModalWrapper enableModal={false}>
                  <div className="bg-white dark:bg-stone-800 rounded-3xl shadow-xl w-[90%] max-w-md px-6 py-6 modal-fade-in">
                        {/* Icon */}
                        <div className="flex justify-center mb-2">
                              <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
                                    <AlertTriangle className="w-8 h-8 text-red-500" />
                              </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-center text-lg font-semibold text-stone-800 dark:text-white mb-2">Warning</h2>
                        {/* Message */}
                        <p className="text-center text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-6">{message}</p>
                        {/* Button */}
                        <button onClick={() => setModalOpen(prev => ({ ...prev, open: null }))} className={`w-full py-2.5 rounded-xl text-sm font-medium text-white bg-linear-to-r ${theme.base} ${theme.hover} transition-all active:scale-95`}>Okay</button>
                  </div>
            </ModalWrapper>
      );
}
