
export default function PageHeader({ pageName }){
      return (
            <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                        <h1 className="text-sm md:text-lg font-bold text-stone-900 dark:text-stone-100">{pageName}</h1>
                  </div>
                  <p className="text-[10px] md:text-xs text-stone-500 dark:text-stone-400">Welcome back, Admin!</p>
            </div>
      );
}