
export default function CardSideIcon({ title, icon, iconBg, colSpan, children }){
      return (
            <div className={`${colSpan} relative p-4 md:p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 transform hover:scale-103 flex flex-col justify-between`} >
                  <p className="text-xs md:text-sm  font-semibold text-gray-600 dark:text-gray-300 flex justify-between items-center gap-2 ">
                        {title}
                        <span className={`${iconBg} p-2 rounded-full`}>{icon}</span>
                  </p>
                  <div className="relative top-1  md:-top-6 left-1/2 -translate-x-1/2 w-full">
                        {children}
                  </div>
            </div>
      );
}