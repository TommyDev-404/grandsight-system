import LoginHeader from "./Header";

export default function Modal({ children, title, description}){
      return (
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-stone-100">
                  <div className="md:w-120 w-[90%]  h-auto rounded-xl p-4 md:px-8 md:pb-10 shadow-xl flex flex-col gap-2 md:gap-4 bg-white">
                        <LoginHeader/>

                        <div className="text-center mb-6 flex flex-col items-center justify-center">
                              <h1 className="text-sm md:text-2xl font-semibold text-stone-800">
                                    {title}
                              </h1>
                              <p className="text-[12px] md:text-sm text-stone-500">
                                    {description}
                              </p>
                        </div>

                        {children}
                  </div>
            </div>
      );
}