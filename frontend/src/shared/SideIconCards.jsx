
export default function SideIconCards({ title, icon, data, bgColor}){
      return (
            <div className="group p-5 bg-white flex justify-between items-center dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg shadow-sm hover:shadow-lg hover:scale-103 transition-all duration-300">
                  <div className="flex flex-col">
                        <p className="text-xs md:text-[16px]  font-medium text-stone-800 dark:text-white">{title}</p>
                        <p className="mt-2 text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">{data}</p>
                  </div>
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>{icon}</div>
            </div>
      );
}