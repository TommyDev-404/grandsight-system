import { lazy, Suspense } from "react";
import { ToggleSidebarProvider } from "../context/ToggleSidebarContext.jsx";
import { PageHeaderProvider } from "../context/PageHeaderContext.jsx";
import { useGlobalContext } from "../context/GlobalStorageContext.jsx";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import BottomNavbar from "../components/Sidebar/BottomSidebarMobile.jsx";
import DarkModeProvider from "../context/DarkModeContext.jsx";

const MobileButton = lazy(() => import('../shared/MobileButton.jsx'));

export default function RootLayout() {
      const { buttons, selectedButton, setSelectedButton } = useGlobalContext();

      return (
            <DarkModeProvider> {/* Responsible for the outer modal pop-up without passing prop on each components*/}
                  <div className="flex flex-col max-h-screen bg-stone-100 dark:bg-stone-800 transition-colors duration-300">
                        <div className="flex flex-1 scrollbar-hide">
                              <PageHeaderProvider>
                                    <ToggleSidebarProvider>
                                          <Sidebar />

                                          <div className="flex flex-col w-full h-screen ">
                                                <Header />
                                                {buttons.length > 0 && 
                                                      <Suspense fallback={null}>
                                                            <MobileButton buttons={buttons} selectedButton={selectedButton} setSelectedButton={setSelectedButton}/>
                                                      </Suspense>
                                                }
                                                
                                                <main className="flex-1 overflow-y-auto p-1.5 md:px-4 md:py-2 scrollbar-hide relative">
                                                      <Outlet /> {/* Responsible for the navigation  */}
                                                </main>

                                                <BottomNavbar />
                                          </div>
                                    </ToggleSidebarProvider>
                              </PageHeaderProvider>
                        </div>
                  </div>
            </DarkModeProvider>
      );
}
