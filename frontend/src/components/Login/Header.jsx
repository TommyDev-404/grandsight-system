import resortLogo from "../../assets/resortLogo.webp";

export default function LoginHeader() {
      return (
            <div className="flex flex-col items-center text-center mb-4 md:mb-6 px-2">

                  {/* Logo */}
                  <img src={resortLogo} className=" w-10 h-10 md:w-14 md:h-14 rounded-full shadow-md mb-2 md:mb-3" alt="Grand Villa Laguna"/>

                  {/* Brand */}
                  <h1 className="text-sm md:text-lg font-semibold text-stone-800">Grand Villa Laguna</h1>
                  <p className="text-[11px] md:text-xs text-stone-500 mb-2 md:mb-3">Admin Portal</p>

                  {/* Soft divider */}
                  <div className="w-full flex items-center gap-2 md:gap-3">
                        <div className="flex-1 h-px bg-stone-200" />
                        <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-stone-400">Welcome</span>
                        <div className="flex-1 h-px bg-stone-200" />
                  </div>

            </div>
      );
}
