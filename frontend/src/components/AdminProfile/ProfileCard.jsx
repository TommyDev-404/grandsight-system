import { useModal } from "../../context/ModalContext";


export default function ProfileCard({ id, email=null, icon, title, info, buttonName, isGreenBg=false}){
      const { openModal } = useModal();

      const handleOpenModal = () => {
            openModal({
                  name : title === 'Username' ? 'edit username' : title === 'Email' ? 'edit email' : title === "Theme" ? 'edit theme' : 'edit number',
                  type : title,
                  payload: { info: info, id: id, email: email && email }
            });
      };

      return (
            <div className="md:flex items-center md:justify-between border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 p-4 rounded-lg shadow-sm hover:scale-101 transition-all duration-200 ease-in-out">
                  <div className="flex flex-col gap-2 md:gap-4">
                        <div className="flex items-center gap-2 md:gap-4">
                              {icon}
                              <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">{title}</p>
                        </div>

                        <p className="text-gray-800 dark:text-gray-100 font-medium">{info}</p>
                  </div>
                  <button onClick={handleOpenModal} className={`text-xs md:text-[18px] px-6 py-2 w-full md:w-auto whitespace-nowrap mt-6  md:translate-0 md:ml-0 md:mt-0 ${isGreenBg ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg  transition`}>{buttonName}</button>
            </div>
      );
}