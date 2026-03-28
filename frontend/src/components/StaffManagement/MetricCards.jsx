import { Eye, Umbrella, UserCheck, UserMinus, Users } from "lucide-react";
import Card from "../../shared/Cards";
import { useModal } from "../../context/ModalContext";
import { useTheme } from "../../context/ThemeContext";
import { useStaffsMetric } from "../../hooks/staffMgmtQueries";

export default function MetricCards(){
      const { theme } = useTheme();
      const { openModal } = useModal();

      const { data: staffMetricData, isLoading } = useStaffsMetric();
      const metrics = staffMetricData?.data || [];

      const handleOpenModal = () => {
            openModal({ name: 'on-leave' });
      };

      return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 h-auto "> 
                  <Card  title={'Total Staff '} icon={<Users className="md:w-5 md:h-5 w-4 h-4 text-blue-500 dark:text-white"/>} iconBg={'bg-blue-50 dark:bg-blue-500'} order={'order-1 md:order-none'}>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-5" >{metrics?.total_staff}</p>
                  </Card>
                  <Card  title={'Total On Duty '} icon={<UserCheck className="md:w-5 md:h-5 w-4 h-4 text-green-500 dark:text-white"/>} iconBg={'bg-green-50 dark:bg-green-500'} order={'order-2 md:order-none'}>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-5" >{metrics?.today_duty}</p>
                  </Card>
                  <Card  title={'Total Absent '} icon={<UserMinus className="md:w-5 md:h-5 w-4 h-4 text-red-500 dark:text-white"/>} iconBg={'bg-red-50 dark:bg-red-500'} order={'order-3 md:order-none'}>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-5" >{metrics?.today_absent}</p>
                  </Card>
                  <Card  title={'Total On Leave '} icon={<Umbrella className="md:w-5 md:h-5 w-4 h-4 text-yellow-500 dark:text-white"/>} iconBg={'bg-yellow-50 dark:bg-yellow-500'} order={'order-4 md:order-none'}>
                        <div className="flex justify-between mt-5">
                              <p className="text-3xl font-bold text-gray-900 dark:text-white" >{metrics?.total_leave}</p>

                              <button onClick={handleOpenModal} className={`flex gap-1 items-center bg-linear-to-r ${theme.base} ${theme}-700 ${theme.hover} text-white px-3 py-1 rounded-full text-sm font-medium transition`}>
                                    <Eye className="w-4 h-4"/> View
                              </button>
                        </div>
                  </Card>
            </div>
      );
}