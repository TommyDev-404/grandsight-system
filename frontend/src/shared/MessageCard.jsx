import { useEffect, useState } from "react";
import { CircleCheck, CircleX } from "lucide-react";
import notifSound from '../assets/notif-sound.mp3';

export default function MessageCard({ status, message, duration = 2000, onClose }) {
      const [fade, setFade] = useState(true); // true = fade in

      useEffect(() => {
            // Play notification sound
            const audio = new Audio(notifSound);
            audio.play().catch(err => console.log("Sound play prevented:", err));

            // Start fade out after duration
            const timer = setTimeout(() => setFade(false), duration);

            // Remove card after fade-out animation (0.3s)
            const removeTimer = setTimeout(() => {
                  if (onClose) onClose();
            }, duration + 300);

            return () => {
                  clearTimeout(timer);
                  clearTimeout(removeTimer);
            };
      }, [duration, onClose]);

      return (
            <div className={`absolute top-4 left-1/2 -translate-x-1/2  bg-white dark:bg-stone-900  rounded-xl shadow-lg  py-2 px-4 md:py-3 md:px-6 flex flex-col items-center justify-center gap-0 z-100 ${fade ? 'modal-fade-in' : 'modal-fade-out'}`}>
                  <div className="shrink-0">
                        {status === 'success' ? <CircleCheck className="w-5 md:w-6 text-green-500"/> : <CircleX className="w-5 md:w-6 md:h-6 text-red-500"/>}
                  </div>

                  <p className={`text-[12px] md:text-sm mt-0.5 md:mt-1 font-normal text-center ${status === 'success' ? 'text-green-500' : 'text-red-500'} dark:text-gray-200`}>{message}</p>
            </div>
      );
}
