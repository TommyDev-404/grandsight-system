

export default function AboveIconMetricCard({ icon, title, data, bgColor }){
      return (
            <div className="p-3 md:p-5 rounded-lg shadow-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex flex-col items-center justify-center hover:shadow-lg hover:scale-103 transition-transform duration-300">
                  <div className={` p-3 ${bgColor} rounded-full mb-2 flex items-center justify-center`}>
                        {icon}
                  </div>
                  <p className="text-[12px] md:text-xs font-semibold text-stone-700 dark:text-stone-200 uppercase">{title}</p>
                  <p className="text-3xl font-extrabold text-stone-900 dark:text-white mt-2" >{data}</p>
            </div>
      );
}