
export default function Card({ title, icon, iconBg, order, children }){
      return (
            <div className={` ${order} p-4 md:p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg shadow-md hover:shadow-lg transition-transform duration-200 transform hover:scale-103 flex flex-col justify-between`} >
                  <p className="text-xs md:text-[17px]  font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                        <span className={`${iconBg} p-2 rounded-full`}>{icon}</span>{title}
                  </p>
                  {children}
		</div>
      );
}