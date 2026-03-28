import { useState } from "react";
import { CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { useModal } from "../../context/ModalContext";
import { useTheme } from "../../context/ThemeContext";
import { useMessageCard } from "../../context/MessageCardContext";
import { useUpdateAdminPassword, useUpdateAdminProfile } from "../../hooks/adminProfileQueries";
import Button from "../../shared/Button";
import ModalWrapper from "../modals/ModalWrapper";


export default function EditProfileDataModal({ closeModal, modalType, data }){
      const { openModal } = useModal();
      const { showMessage } = useMessageCard();
      const { theme, handleChangeTheme } = useTheme();
      const [selectedTheme, setSelectedTheme] = useState(theme);
      const [ showPassword, setShowPassword ] = useState(false);
      const [ inputValue, setInputValue ] = useState(data?.info ?? null);
      const [ formData, setFormData ] = useState({
            new_password: '',
            confirm_password: ''
      });

      const handleSetTheme = (themeSelected) => {
            setSelectedTheme(themeSelected);
      };

      const toggleShowPassword = () => {
            setShowPassword(!showPassword);
      }; 

      const changeTheme = () => {
            handleChangeTheme(selectedTheme);
            closeModal();
      }

      const { mutate: updateAdminProfile, isPending: updateAdminProfileLoading } = useUpdateAdminProfile({ showMessage, closeModal });
      const { mutate: updateAdminPasswrord, isPending: updateAdminPasswordLoading } = useUpdateAdminPassword({ showMessage, closeModal, openModal });

      const handleEditInfo = async() => {
            updateAdminProfile({
                  info: inputValue, 
                  modalType: modalType.split(' ').length > 1 ? modalType.split(' ')[0] : modalType, 
                  id:data.id 
            })
      };

      const handleChangePassword = async() => {
            if (formData.confirm_password !== formData.new_password ){
                  showMessage({ status: 'failed', message: 'Password unmatched! Try again' });
                  return;
            }

            const finalData = { new_password: formData.confirm_password , email: data.email };
            updateAdminPasswrord(finalData);
      };

      return (
            <ModalWrapper 
                  modalTitle={`Update ${modalType === 'Password Last Changed' ? 'Password' : modalType}`}
                  modalTitleDescription={modalType === 'Password Last Changed' ? 'Enter and change new password for better security.' : `Update ${modalType} for the betterness of the system.`}
                  className={'md:w-[25%]'}
                  closeModal={closeModal}
            >
                  <div className="p-3 flex flex-col ">
                        {modalType === 'Password Last Changed' ? 
                                    <>
                                          <input  type={showPassword ? 'text' : 'password'} value={formData.new_password} onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}  className="text-sm w-full p-4 mb-4 mt-2 border border-stone-300 dark:border-stone-400 rounded-lg text-stone-900 dark:text-white dark:bg-stone-800" placeholder={`Enter new password`}/>
                                          <input type={showPassword  ? 'text' : 'password'} value={formData.confirm_password} onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}  className="text-sm w-full p-4 mb-4 border border-stone-300 dark:border-stone-400 rounded-lg text-stone-900 dark:text-white dark:bg-stone-800" placeholder={`Confirm password`}/>
                                          <div className="flex gap-2 items-center mb-4 -mt-3 justify-end cursor-pointer" onClick={toggleShowPassword}> 
                                                <input type="checkbox" readOnly checked={showPassword}/>
                                                <span className="text-xs md:text-sm text-stone-700 dark:text-stone-300">Show Password</span>
                                          </div>
                                    </> 
                              :
                              modalType === "Theme" ? 
                                    <select value={selectedTheme.name} onChange={(e) => handleSetTheme(e.target.value)}  className="border border-stone-200 dark:border-stone-400 mb-4 mt-2 px-4 py-4 w-full rounded-lg text-stone-800 dark:text-white">
                                          <option hidden>Select Theme</option>
                                          <option value={'greenTeal'}>Forest Green</option>
                                          <option value={'purplePink'}>Retro Purple</option>
                                          <option value={'bluePurple'}>Blue Purple</option>
                                    </select>
                              :  <input  className="text-sm w-full p-4 mb-4 mt-2 border border-stone-300 dark:border-stone-400 rounded-lg text-stone-900 dark:text-white dark:bg-stone-800" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={`Enter new ${modalType.toLowerCase()}`}/>
                        }

                        <Button 
                              icon={updateAdminProfileLoading || updateAdminPasswordLoading ? <Loader2Icon className="w-4 h-4 animate-spin text-white" /> : <CheckCircle2Icon className="w-3 md:w-4" />}
                              text={
                                    (updateAdminProfileLoading || updateAdminPasswordLoading) && modalType === 'Password Last Changed' ? 'Sending code...' 
                                    : (updateAdminProfileLoading || updateAdminPasswordLoading) && modalType !== 'Password Last Changed' ? 'Updating...' 
                                    : 'Update'
                              } 
                              clickEvent={modalType === 'Password Last Changed' ? handleChangePassword : modalType === 'Theme' ?  changeTheme :  handleEditInfo}
                              type={'button'} 
                              className={'text-xs md:text-sm mt-0 md:mt-2 p-2 md:p-3'}
                        />
                  </div>
                  
            </ModalWrapper>
      );
}

/* 


*/