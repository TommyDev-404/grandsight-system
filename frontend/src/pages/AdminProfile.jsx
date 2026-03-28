import { useEffect } from "react";
import { Mail, Phone, User, Lock } from "lucide-react";
import { CgColorPicker } from "react-icons/cg";
import { useTheme } from "../context/ThemeContext";
import { useAdminProfileInfo } from "../hooks/adminProfileQueries";
import { useGlobalContext } from "../context/GlobalStorageContext";
import profile from "../assets/resortLogo.webp";
import profileBg from "../assets/bg.webp";
import ProfileCard from "../components/AdminProfile/ProfileCard";

export default function AdminProfile(){
      const { setButtons, setSelectedButton } = useGlobalContext();
      const { theme } = useTheme();
      const themeName = { 
            bluePurple: 'Blue Purple',
            greenTeal: 'Forest Green',
            purplePink: 'Retro Purple'
      };

      const { data: adminInfoData, isLoading } = useAdminProfileInfo();
      const adminInfo = adminInfoData?.data ?? "";

      useEffect(() =>  {
            setButtons([]);
            setSelectedButton('')
      }, []);

      return (
		<section>
                  <div>
                        <div className="md:p-6 p-4 bg-white border border-stone-200 dark:border-stone-700 dark:bg-stone-900 rounded-lg shadow-md">
                              <div className="relative">
                                    <div className="md:h-[30vh] h-40 relative">
                                          <img src={profileBg} alt="Resort Background"   className="w-full h-full object-cover rounded-t-lg" loading="lazy"/>
                                    </div>
                                    <div className="absolute left-1/2 -translate-x-1/2 top-12 w-[40vw] max-w-70 aspect-square rounded-full border-6 sm:border-8 border-white dark:border-stone-900 overflow-hidden bg-stone-200 z-10">
                                          <img src={profile} alt="Resort Logo" className="w-full h-full object-cover"/>
                                    </div>
                                    <div className="md:mt-18 mt-10  mb-3 md:mb-6 text-center">
                                          <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-3xl font-bold text-gray-900 dark:text-white">Admin Profile</h1>
                                    </div>
                              </div>
                              
                              <div className="space-y-4">
                                    <ProfileCard icon={<User className="text-stone-800 dark:text-white"/>} title={'Username'} info={adminInfo?.username} id={adminInfo?.id} buttonName={'Edit'} />
                                    <ProfileCard icon={<Mail className="text-stone-800 dark:text-white"/>} title={'Email'} info={adminInfo?.email}  id={adminInfo?.id} buttonName={'Edit'}/>
                                    <ProfileCard icon={<Phone  className="text-stone-800 dark:text-white"/>} title={'Contact Number'} info={adminInfo?.contact}  id={adminInfo?.id} buttonName={'Edit'}/>
                                    <ProfileCard icon={<CgColorPicker  className="text-stone-800 dark:text-white"/>} title={'Theme'} info={`${themeName[theme.name]} Theme`} buttonName={'Change Theme'} isGreenBg={true} />
                                    <ProfileCard icon={<Lock  className="text-stone-800 dark:text-white"/>} title={'Password Last Changed'}  id={adminInfo?.id} email={adminInfo?.email} info={new Date(adminInfo?.date_pass_change).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric'})} buttonName={'Change Password'} isGreenBg={true}/>
                              </div>
                        </div>
                  </div>
            </section>
      );
}