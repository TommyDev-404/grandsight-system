import { useEffect, useRef } from "react";
import { User, DollarSignIcon, Bookmark, BarChart, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useLiveOperational } from "../../hooks/dashboardQueries";
import Card from "../../shared/Cards";

export default function LiveOperationalMetric(){
      const canvasRef =  useRef(null);
      const chartRef = useRef(null);
      const { data: liveOperational } = useLiveOperational();

      useEffect(() => {
            if (!canvasRef.current || !liveOperational?.occupancy) return;

            let chartInstance;

            const loadChart = async () => {
            const { Chart } = await import("chart.js/auto");

            // Destroy previous instance if exists
            if (chartRef.current) {
                  chartRef.current.destroy();
            }

            chartInstance = createOccupancyChart(
                  Chart,
                  canvasRef.current,
                  liveOperational.occupancy.occupancy ?? 0,
                  document.documentElement.classList.contains("dark")
            );

            chartRef.current = chartInstance;
            };

            loadChart();

            return () => {
            chartInstance?.destroy();
      };

      }, [liveOperational]);

      return (
            <section>
                  <h2 className="text-sm md:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Live Operational Status</h2>
                  <div className="grid md:grid-cols-4 grid-cols-1 gap-4 ">
                        <Card  title={'Guests Currently In-House'} icon={<User className="w-3 h-3 md:w-4 md:h-4 text-teal-500 dark:text-white"/>} iconBg={'bg-teal-50 dark:bg-teal-500'} order={'order-1 md:order-none'}>
                              <p className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-3" >{liveOperational?.total_guest_in_house.guest ?? '--'}</p>
                              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">Active Bookings:<span className="font-semibold dark:text-teal-400 ml-1" >{liveOperational?.total_guest_in_house.bookings ?? '--'}</span></p>
                              <div className="mt-3 flex justify-end items-center gap-1 text-xs md:text-sm">
                                    {liveOperational?.total_guest_in_house.change > 0 ?
                                          <>
                                                <ArrowUpRight className={`text-green-500 font-bold`}/>
                                                <span className="font-semibold text-green-500 dark:text-green-400" >+{liveOperational?.total_guest_in_house.change}</span>
                                          </>
                                          :
                                          <>
                                                <ArrowDownLeft className={`text-red-500 font-bold`}/>
                                                <span className="font-semibold text-red-500 dark:text-red-400" >{liveOperational?.total_guest_in_house.change}</span>
                                          </>
                                    }
                                    <span className="text-gray-500 dark:text-gray-400 ml-1">vs Previous</span>
                              </div>
                        </Card>
                        <Card title={'Revenue Today'} icon={<DollarSignIcon className="w-3 h-3 md:w-4 md:h-4 text-blue-500 dark:text-white"/>} iconBg={'bg-blue-50 dark:bg-blue-500'} order={'order-4 md:order-none'}>
                              <p className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white md:mt-0 mt-4" >{liveOperational?.revenue?.current_revenue != null ? new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(liveOperational.revenue.current_revenue): "--"}</p>
                              <div className="mt-3 flex justify-end items-center gap-1 text-xs md:text-sm">
                                    {liveOperational?.revenue.change > 0 ?
                                          <>
                                                <ArrowUpRight className={`text-green-500 font-bold`}/>
                                                <span className="font-semibold text-green-500 dark:text-green-400" >+{liveOperational?.revenue.change}</span>
                                          </>
                                          :
                                          <>
                                                <ArrowDownLeft className={`text-red-500 font-bold`}/>
                                                <span className="font-semibold text-red-500 dark:text-red-400" >{liveOperational?.revenue.change}</span>
                                          </>
                                    }
                                    <span className="text-gray-500 dark:text-gray-400 ml-1">vs Yesterday</span>
                              </div>
                        </Card>
                        <Card title={'Active Reservations'} icon={<Bookmark className="w-3 h-3 md:w-4 md:h-4 text-green-500 dark:text-white"/>} iconBg={'bg-green-50 dark:bg-green-500'} order={'order-3 md:order-none'} >
                              <p className="text-2xl md:text-4xl font-extrabold text-gray-900 dark:text-white md:mt-0 mt-4" >{liveOperational?.active_reservation.count ?? '--'}</p>
                              <div className="mt-3 flex justify-end items-center gap-1 text-xs md:text-sm">
                                    <span className="text-stone-500 dark:text-stone-300">Total Guests: </span>
                                    <span className="font-semibold dark:text-white">{liveOperational?.active_reservation.total_guests ?? '--'}</span>
                              </div>
                        </Card>
                        <Card title={'Current Occupancy'} icon={<BarChart className="w-3 h-3 md:w-4 md:h-4 text-red-500 dark:text-white"/>} iconBg={'bg-red-50 dark:bg-red-500'}  order={'order-2 md:order-none'} >
                              <div className="relative w-full h-20 flex justify-center items-center">
                                    <canvas ref={canvasRef} className="w-full h-full"></canvas>
                              </div>

                              <div className="flex items-center gap-2 justify-center text-xs md:text-sm dark:text-gray-200 text-gray-800 space-x-1 mt-3">
                                    Available Areas:
                                    <span className="font-medium dark:text-white text-black">{liveOperational?.occupancy.total_area ?? '--'}</span>
                              </div>
                        </Card>
                  </div>
            </section>
      );
}

function createOccupancyChart(Chart, canvas, occupancyValue) {
      const isDarkMode = document.documentElement.classList.contains("dark");
      const occupiedColor = isDarkMode ? "#22c55e" : "#16a34a";
      const availableColor = isDarkMode ? "rgba(255,255,255,0.15)" : "#e5e7eb";
      
      const centerTextPlugin = {
            id: "centerText",
            afterDraw(chart) {
                  const { ctx, chartArea } = chart;
                  if (!chartArea) return;

                  const centerX = (chartArea.left + chartArea.right) / 2;
                  const centerY = chartArea.bottom - 12;

                  ctx.save();
                  ctx.textAlign = "center";
                  ctx.textBaseline = "middle";

                  ctx.font = "bold 28px sans-serif";
                  ctx.fillStyle = "#3b82f6";
                  ctx.fillText(Math.round(occupancyValue), centerX, centerY);

                  ctx.font = "bold 16px sans-serif";
                  ctx.fillText("%", centerX + 22, centerY);

                  ctx.restore();
            }
      };

      return new Chart(canvas, {
            type: "doughnut",
            data: {
                  datasets: [
                        {
                        data: [occupancyValue, 100 - occupancyValue],
                        backgroundColor: [occupiedColor, availableColor],
                        borderWidth: 0
                        }
                  ]
            },
            options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  rotation: -90,
                  circumference: 180,
                  cutout: "75%",
                  radius: "95%",
                  plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                  },
                  animation: {
                        duration: 1200,
                        easing: "easeOutCubic"
                  }
            },
            plugins: [centerTextPlugin]
      });
}
