

export default function BigCard({ title, icon, label, colSpan, children }) {
      return (
            <div className={`${colSpan} bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-700 h-[55vh] shadow-sm rounded-lg p-3 md:p-4 hover:shadow-lg hover:scale-101 transition-all duration-200 ease-in-out`}>
                  <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                              {icon}
                              <h2 className="text-xs md:text-[17px] font-medium text-stone-800 dark:text-white">{title} </h2>
                        </div>
                        <p className="text-[12px] md:text-xs text-stone-800 dark:text-stone-200">{label}</p>
                  </div>
                  {children}
            </div>
      );
}