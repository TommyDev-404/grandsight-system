import LoadingSpinner from "../../shared/LoadingSpinner";

export default function BookingReportTable({ revenueData, isLoading }){
      return (
            <>
                  {/* ===== DESKTOP VIEW (Table) ===== */}   
                  <div className="hidden md:flex overflow-y-auto h-[calc(90vh-260px)] scrollbar-hide">
                        <table className="min-w-full table-fixed text-sm text-center">
                              <thead className="sticky top-0 bg-stone-800 dark:bg-stone-700 text-white z-10 whitespace-nowrap">
                                    <tr>
                                          <th className="px-6 py-3 text-center font-medium uppercase tracking-wider">Month</th>
                                          <th className="px-6 py-3 text-center font-medium uppercase tracking-wider ">Direct Payments</th>
                                          <th className="px-6 py-3 text-center font-medium uppercase tracking-wider ">Zuzu Payments</th>
                                          <th className="px-6 py-3 text-center font-medium uppercase tracking-wider ">Overall Income</th>
                                    </tr>
                              </thead>

                              <tbody className="bg-white dark:bg-stone-900">
                                    {isLoading ? 
                                          <LoadingSpinner/>
                                    :
                                          revenueData.map(data => (
                                                <tr key={data.month_name} className="bg-stone-50 dark:bg-stone-900 dark:hover:bg-stone-800 hover:bg-stone-100 border-b border-stone-200 dark:border-stone-700 text-xs md:text-[17px] whitespace-nowrap text-stone-800 dark:text-white">
                                                      <td className="p-3">{data.month_name}</td>
                                                      <td className="p-3">{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data.direct)}</td>
                                                      <td className="p-3">{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data.online)}</td>
                                                      <td className="p-3">{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data.total)}</td>
                                                </tr>
                                          ))
                                    }
                              </tbody>

                        </table>
                  </div>

                  {/* ===== MOBILE VIEW (Cards) ===== */}
                  <div className="space-y-3 md:hidden h-[calc(90vh-290px)] pt-2 overflow-y-auto scrollbar-hide">
                        {isLoading ? 
                              <LoadingSpinner/>
                        :
                              revenueData.map((data, index) => (
                                    <div key={data.month_name} className="relative rounded-xl border border-stone-200 dark:border-stone-700  bg-stone-50 dark:bg-stone-800 p-3 md:p-4 shadow-sm hover:shadow-md  transition-shadow space-y-4">
                                          {/* Header */}
                                          <div className="flex items-center justify-between">
                                                <h3 className="text-[18px] font-semibold text-gray-700 dark:text-gray-200">{data.month_name}</h3>
                                                <span className="text-[11px] px-2 py-0.5 rounded-full  bg-blue-100 text-blue-700 dark:bg-green-900/30 dark:text-blue-400">Monthly Income</span>
                                          </div>
                                          
                                          {/* Payments */}
                                          <div className="flex flex-col">
                                                <div className="flex items-center justify-between">
                                                      <p className="text-xs text-gray-500 dark:text-gray-400">Direct Payment</p>
                                                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data.direct)}</span>
                                                </div>
                                          
                                                <div className="flex items-center justify-between">
                                                      <p className="text-xs text-gray-500 dark:text-gray-400">ZUZU Payment</p>
                                                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data.online)}</span>
                                                </div>
                                          </div>
                                          
                                          {/* Divider */}
                                          <div className="h-px bg-stone-200 dark:bg-stone-700" />
                                          
                                          {/* Total */}
                                          <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Overall Income</p>
                                                <span className="text-lg font-semibold text-green-600 dark:text-green-400">{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(data.total)}</span>
                                          </div>
                                    </div>
                              ))
                        }
                  </div>
            </>
      );    
}