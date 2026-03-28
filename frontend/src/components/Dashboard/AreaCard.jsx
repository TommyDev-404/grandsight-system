
export default function AreaCard({ roomName, icon, iconBgColor, occupied, reserved, needClean, available, total }) {
      const percentage = Number(total) > 0 ? (Number(available) / Number(total)) * 100 : 0;
      
      return (
            <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-sm hover:shadow-md transition hover:scale-103">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                        <h2 className="text-sm md:text-base font-semibold text-stone-800 dark:text-stone-100">{roomName}</h2>
                        <div className={`${iconBgColor} p-2 rounded-lg text-white`}>{icon}</div>
                  </div>
      
                  {/* Stats */}
                  <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-stone-600 dark:text-stone-300">
                              <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-red-500" />Occupied
                              </span>
                              <span className="font-medium">{occupied}</span>
                        </div>
            
                        <div className="flex justify-between text-stone-600 dark:text-stone-300">
                              <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500" />Reserved
                              </span>
                              <span className="font-medium">{reserved}</span>
                        </div>
            
                        <div className="flex justify-between text-stone-600 dark:text-stone-300">
                              <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500" />Needs Cleaning
                              </span>
                              <span className="font-medium">{needClean}</span>
                        </div>
                  </div>
      
                  {/* Divider */}
                  <div className="my-4 h-px bg-stone-200 dark:bg-stone-700" />
      
                  {/* Availability */}
                  <div>
                        <div className="flex justify-between text-xs text-stone-600 dark:text-stone-300 mb-1">
                              <span>Available</span>
                              <span className="font-semibold">{available} / {total}</span>
                        </div>
            
                        <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 transition-all" style={{ width: `${percentage}%` }}/>
                        </div>
                  </div>
            </div>
      );
}
