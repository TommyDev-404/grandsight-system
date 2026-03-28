import { BarChart3, CalendarArrowUpIcon, Clock10Icon, TrendingUp, TrendingUpDownIcon } from "lucide-react";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Chart, BarController, BarElement, CategoryScale, LinearScale, LineController, LineElement, PointElement, ArcElement, Tooltip, Legend, PieController} from "chart.js";
import { useDarkMode } from "../../context/DarkModeContext";
const BigCard = lazy(() => import("../../shared/BigCard"));
import { useBookingStats, useBookingTrend } from "../../hooks/dashboardQueries";

Chart.register( BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, LineController, LineElement, PointElement, ArcElement, PieController );

export default function Charts(){
      const { currentMode } = useDarkMode();

      const { data: bookingTrendData, isLoading: monthlyTrendLoading } = useBookingTrend();
      const { data: bookingStatsData, isLoading: bookingDistributionLoading } = useBookingStats();

      const monthlyTrend = bookingTrendData?.monthly_bookings;
      const weeklyTrend = bookingTrendData?.weekly_trends;
      const bookingDistribution = bookingStatsData?.booking_type_distribution;
      const topBookedArea = bookingStatsData?.top_booked_areas;

      const monthlyCanvas = useRef(null);
      const monthlyChartRef = useRef(null);
      const weeklyCanvas = useRef(null);
      const weeklyChartRef = useRef(null);
      const chartRef = useRef(null);
      const chartCanvasRef = useRef(null);

      // ====== CHARTS READY STATE ======
      const [chartsReady, setChartsReady] = useState(false);

      useEffect(() => {
            const timer = setTimeout(() => setChartsReady(true), 200);
            return () => clearTimeout(timer);
      }, []);

      useEffect(() => {
            if (!chartsReady || !bookingDistribution || !chartCanvasRef.current) return;
      
            chartRef.current = createBookingTypePieChart({
                  canvas: chartCanvasRef.current,
                  bookingData: bookingDistribution,
                  isDarkMode: currentMode === 'dark',
            });
      
            return () => chartRef.current?.destroy();
      }, [ chartsReady, bookingDistribution, currentMode ]);

      useEffect(() => {
            if (!chartsReady ||  !monthlyTrend || !monthlyCanvas.current) return;

            monthlyChartRef.current = createMonthlyBookingsChart({
                  canvas: monthlyCanvas.current,
                  monthlyBookings: monthlyTrend,
                  isDarkMode: currentMode === 'dark'
            });

            return () => {
                  monthlyChartRef.current?.destroy();
            };
      }, [ chartsReady, monthlyTrend, currentMode ]);
      
      useEffect(() => {
            if (!chartsReady ||  !weeklyTrend || !weeklyCanvas.current) return;

            weeklyChartRef.current = createTrendChart({
                  canvas: weeklyCanvas.current,
                  weeklyTrends: weeklyTrend,
                  isDarkMode: currentMode === 'dark'
            });

            return () => {
                  weeklyChartRef.current?.destroy();
            };
      }, [ chartsReady, weeklyTrend, currentMode ]);

      return (
            <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-3  pb-1 md:border-b border-stone-200  dark:border-stone-700">
                        <TrendingUpDownIcon className="w-4 h-4 md:w-6 md:h-6 text-green-500 dark:text-green-400"/>
                        <h2 className="text-sm md:text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">Summary Charts</h2>
                  </div>

                  <Suspense fallback={null}>
                        <div className="grid md:grid-cols-20 grid-cols-1 gap-4">
                              {/* Monthly Bookings */}
                              <BigCard title="Monthly Bookings" icon={<BarChart3 className="w-5 h-5 text-blue-500" />} label="(This Year)" colSpan="md:col-span-13">
                                    <div className="relative h-[40vh] md:h-[46vh] mt-4 bg-stone-50 dark:bg-stone-800 p-2 rounded-xl">
                                          <canvas ref={monthlyCanvas} />
                                    </div>
                              </BigCard>

                              {/* Top % Most Booked Area */}
                              <BigCard title={'Top 5 Most Booked Area'} icon={ <TrendingUp className="w-5 -h-5 text-green-500"/> } label={'(Historical)'} colSpan={'md:col-span-7'}>
                                    <div className="mt-8 space-y-4 ">
                                          {topBookedArea && topBookedArea.map((area, index) => (
                                                <div key={index}>
                                                      {createMostBookedArea({ area_name: area.area_name, percentage: area.percentage })}
                                                </div>
                                          ))}
                                    </div>
                              </BigCard>
                        </div>

                        <div className="grid md:grid-cols-20 gap-4">
                              {/* Booking Type Distribution */}
                              <BigCard title={'Booking Type Distribution'} icon={  <Clock10Icon className="w-5 -h-5 text-yellow-500"/> } label={'(Historical)'} colSpan={'md:col-span-7'}>
                                    <div className="relative h-[40vh] md:h-[46vh] mt-4 flex justify-center">
                                          <canvas ref={chartCanvasRef} />
                                    </div>
                              </BigCard>

                              {/* Guest Trend */}
                              <BigCard title={'Guest & Revenue Trend'} icon={  <CalendarArrowUpIcon className="w-5 -h-5 text-blue-500"/> } label={'(This Week)'} colSpan={'md:col-span-13'}>
                                    <div className="relative h-[40vh] md:h-[46vh] mt-4 bg-stone-50 dark:bg-stone-800 p-2 rounded-xl">
                                          <canvas ref={weeklyCanvas} />
                                    </div>
                              </BigCard>
                        </div>
                  </Suspense>
            </div>
      );
}

function createMonthlyBookingsChart({ canvas, monthlyBookings, isDarkMode }) {
      const textColor = isDarkMode ? "#e5e7eb" : "#1f2937";
      const gridColor = isDarkMode ? "#525252" : "#e0e0e0"; 

      return new Chart(canvas, {
            type: "bar",
            data: {
            labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
            datasets: [
                  {
                        label: "Bookings",
                        data: monthlyBookings,
                        backgroundColor: "#3b82f6",
                        borderRadius: 6
                  }
            ]
            },
            options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
            legend: {
                        labels: { color: textColor }
                  },
                  tooltip: {
                        backgroundColor: "#111827",
                        titleColor: "#FBBF24",
                        bodyColor: "#F9FAFB",
                        borderColor: "#374151",
                        borderWidth: 1,
                        padding: 10,
                        titleFont: { size: 23, weight: "bold" },
                        bodyFont: { size: 22 },
                        callbacks: {
                        label(context) {
                        return `${context.label}: ${context.parsed.y} Bookings`;
                        }
                        }
                  }
            },
            scales: {
            y: {
                  beginAtZero: true,
                  ticks: { color: textColor },
                  grid: { color: gridColor }
            },
            x: {
                  ticks: { color: textColor },
                  grid: { display: false }
            }
            }
            }
      });
}

function createTrendChart({ canvas, weeklyTrends, isDarkMode }) {
      const textColor = isDarkMode ? "#e5e7eb" : "#1f2937";
      const gridColor = isDarkMode ? "#525252" : "#e0e0e0"; 

      return new Chart(canvas, {
            type: "line",
            data: {
            labels: weeklyTrends.map(d =>
                  new Date(d.day_date).toLocaleDateString("en-US", { weekday: "short" })
            ),
            datasets: [
                  {
                  label: "Revenue",
                  data: weeklyTrends.map(d => d.revenue),
                  borderColor: "rgba(59,130,246,1)", // blue-500
                  backgroundColor: "rgba(59,130,246,0.2)",
                  tension: 0.3
                  },
                  {
                  label: "Guests",
                  data: weeklyTrends.map(d => d.guest_count),
                  borderColor: "rgba(16,185,129,1)", // emerald green
                  backgroundColor: "rgba(16,185,129,0.2)",
                  tension: 0.3
                  },
                  {
                  label: "Check-ins",
                  data: weeklyTrends.map(d => d.checkin_count),
                  borderColor: "rgba(234,179,8,1)", // amber
                  backgroundColor: "rgba(234,179,8,0.2)",
                  tension: 0.3
                  }
            ]
            },
            options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                  legend: {
                  labels: { color: textColor }
                  },
                  tooltip: {
                  mode: "nearest",
                  intersect: false,
                  backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb",
                  titleColor: isDarkMode ? "#FBBF24" : "#1f2937",
                  bodyColor: isDarkMode ? "#F9FAFB" : "#111827",
                  borderColor: isDarkMode ? "#374151" : "#d1d5db",
                  borderWidth: 1,
                  padding: 20,
                  titleFont: { size: 28, weight: "bold" },
                  bodyFont: { size: 26 },
                  callbacks: {
                  label(context) {
                        const label = context.dataset.label || "";
                        const value = context.parsed.y;
                        if (label === "Revenue") {
                        return `${label}: ${value.toLocaleString("en-PH", {
                        style: "currency",
                        currency: "PHP"
                        })}`;
                        }
                        return `${label}: ${value}`;
                  }
                  }
                  }
            },
            scales: {
                  y: {
                  beginAtZero: true,
                  ticks: { color: textColor },
                  grid: { color: gridColor }
                  },
                  x: {
                  ticks: { color: textColor },
                  grid: { color: gridColor }
                  }
            }
            }
      });
}

function createBookingTypePieChart({ canvas, bookingData, isDarkMode }) {
      const textColor = isDarkMode ? "#e5e7eb" : "#1f2937";
      const borderColor = isDarkMode ? "#374151" : "#d1d5db";

      return new Chart(canvas, {
            type: "pie",
            data: {
                  labels: ["Overnight", "Day Guest"],
                  datasets: [
                  {
                  data: [
                        Number(bookingData.checkin_total || 0),
                        Number(bookingData.day_guest_total || 0),
                  ],
                  backgroundColor: ["#3b82f6", "#eab308"],
                  },
                  ],
            },
            options: {
                  responsive: true,
                  plugins: {
                  legend: {
                  labels: {
                        color: textColor,
                        font: { size: 12 },
                  },
                  },
                  tooltip: {
                  enabled: true,
                  backgroundColor: "#111827",
                  titleColor: "#FBBF24",
                  bodyColor: "#F9FAFB",
                  borderColor: borderColor,
                  borderWidth: 1,
                  padding: 15,
                  titleFont: { size: 20, weight: "bold" },
                  bodyFont: { size: 18, weight: "bold" },
                  callbacks: {
                        label(context) {
                        const label = context.label || "";
                        const value = context.parsed;
                        return `${label}: ${value} Bookings`;
                        },
                  },
                  },
                  },
            },
      });
}

function createMostBookedArea({ area_name, percentage }) {
      const area_color =  {
            'premium': 'bg-green-400',
            'standard': 'bg-yellow-400',
            'barkada': 'bg-blue-400',
            'garden': 'bg-indigo-400',
            'family': 'bg-red-400',
            'cabana': 'bg-teal-400',
            'small': 'bg-orange-400',
            'big': 'bg-purple-400'
      };

      return (
            <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                              <span className={`w-3 h-3 ${area_color[area_name.split(' ')[0].toLowerCase()]} rounded-full`}></span>
                              <p className="text-sm text-gray-800 dark:text-gray-100 font-medium">{area_name}</p>
                        </div>
                        <p className="text-sm font-semibold text-black dark:text-gray-400">{percentage}%</p>
                  </div>
                  <div className="h-2 dark:bg-gray-700 bg-black/5 rounded-full overflow-hidden">
                        <div className={`h-2 ${area_color[area_name.split(' ')[0].toLowerCase()]} rounded-full`} style={{ width: `${percentage}%` }}></div>
                  </div>
            </div>
      );
}
