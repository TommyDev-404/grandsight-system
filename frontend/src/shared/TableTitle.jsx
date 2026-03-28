
export default function TableTitle({ icon, title, showBorderBottom=true}){
      return (   
            <div className={`flex justify-between items-center ${showBorderBottom ? 'mb-2  border-b border-stone-200 dark:border-stone-700' : ''}`}>
                  <h3 className="text-[15px] md:text-lg font-semibold mb-2 flex items-center gap-2 md:gap-3">
                        {icon}
                        <span  className="text-gray-900 dark:text-white">{title}</span>
                  </h3>      
            </div>
      );
}