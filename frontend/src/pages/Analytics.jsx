import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { DollarSignIcon, UserCheckIcon } from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { 
      Chart, 
      BarController, 
      BarElement, 
      CategoryScale, 
      LinearScale, 
      LineController, 
      LineElement, 
      PointElement, 
      ArcElement, 
      Tooltip, 
      Legend, 
      PieController, 
      Filler
} from "chart.js";
import { 
      useAnalyticForecast, 
      useAnalyticStatistics, 
      useAnalyticMetric, 
      useGetAllResortArea, 
      analyticsQueries 
} from "../hooks/analyticsQueries";
import { useDarkMode } from "../context/DarkModeContext";
import { useGlobalContext } from "../context/GlobalStorageContext";

import Filter from "../components/Analytics/Filter";
import LoadingSpinner from '../shared/LoadingSpinner';
import useDesktop from "../hooks/useDesktop";
import { useQueryClient } from "@tanstack/react-query";

const StatsCharts = lazy(() => import("../components/Analytics/StatsChart"));
const BigCard = lazy(() => import("../shared/BigCard"));
const AnalyticsMetricCards = lazy(() => import("../components/Analytics/MetricCards"));

Chart.register( 
      BarController, 
      BarElement, 
      CategoryScale, 
      LinearScale, 
      Tooltip, 
      Legend, 
      LineController, 
      LineElement, 
      PointElement, 
      ArcElement, 
      PieController, 
      Filler 
);

export default function Analytics(){
      const isDesktop  = useDesktop();
      const { currentMode } = useDarkMode();
      const isDark = currentMode === 'dark' ? true : false;
      const { selectedButton, setButtons, setSelectedButton } = useGlobalContext();

      const [ area, setArea ] = useState('All Resort Areas');

      const checkInRef = useRef();
      const checkInCanvas = useRef();
      const revenueRef = useRef();
      const revenueCanvas = useRef();
      
      const queryClient = useQueryClient();

      // ====== CHARTS READY STATE ======
      const [chartsReady, setChartsReady] = useState(false);

      useEffect(() => {
            async function prefetchAllAnalytics() {
                  try {
                        // 1. Prefetch static queries (statistics & all areas)
                        const prefetches = [
                              queryClient.prefetchQuery(analyticsQueries.statistics()),
                              queryClient.prefetchQuery(analyticsQueries.allResortArea()),
                        ];
            
                        // 2. Get list of areas to prefetch
                        // Option 1: just prefetch the default area
                        const areasToPrefetch = ['All Resort Areas']; // replace with dynamic list if needed
            
                        // 3. Prefetch metrics & forecasts for each area
                        areasToPrefetch.forEach((area) => {
                              prefetches.push(queryClient.prefetchQuery(analyticsQueries.metric(area)));
                              prefetches.push(queryClient.prefetchQuery(analyticsQueries.forecast(area)));
                        });
            
                        // 4. Wait until all prefetches finish
                        await Promise.all(prefetches);
                  } catch (error) {
                        console.error("Analytics prefetch failed:", error);
                  }
            }

            prefetchAllAnalytics();
        }, []); // empty dependency = runs once on mount

      const { data: forecastData, isLoading: forecastDataLoading } = useAnalyticForecast(area);
      const { data: metricData, isLoading: metricLoading } = useAnalyticMetric(area);
      const { data: statisticsData, isLoading: statisticsLoading } = useAnalyticStatistics();
      const { data: allAreas, isLoading: allAreasLoading } = useGetAllResortArea();
      
      const pageLoading = forecastDataLoading || metricLoading || statisticsLoading || allAreasLoading;
      const isForecastChartLoading = forecastDataLoading || !chartsReady;

      useEffect(() =>  {
            setButtons(['Performance', 'Trends & Forecasts']);
            setSelectedButton('Performance')
      }, []);
      
      useEffect(() => {
            const timer = setTimeout(() => setChartsReady(true), 200);
            return () => clearTimeout(timer);
      }, []);

      // ====== FORECAST CHARTS (Check-in + Revenue) ======
      useEffect(() => {
            if (!chartsReady || !forecastData || !checkInCanvas.current || !revenueCanvas.current) return;

            // ----- Check-in Chart -----
            if (checkInRef.current) {
                  checkInRef.current.destroy();
                  checkInRef.current = null;
            }
            
            checkInRef.current = createCheckinForecastChart({
                  canvas: checkInCanvas.current,
                  data: forecastData.forecast_checkin,
                  isDarkMode: currentMode === 'dark',
            });

            // ----- Revenue Chart -----
            if (revenueRef.current) {
                  revenueRef.current.destroy();
                  revenueRef.current = null;
            }

            revenueRef.current = createRevenueForecastChart({
                  canvas: revenueCanvas.current,
                  data: forecastData.forecast_revenue,
                  isDarkMode: currentMode === 'dark',
            });

            return () => {
                  checkInRef.current?.destroy();
                  checkInRef.current = null;
                  revenueRef.current?.destroy();
                  revenueRef.current = null;
            };
      }, [ isDesktop, chartsReady, forecastData, currentMode, selectedButton ]);

      if (pageLoading && area === 'All Resort Areas') return <LoadingSpinner/>;

      return (
            <SkeletonTheme  baseColor={isDark ? "#374151" : "#e5e7eb"} highlightColor={isDark ? "#4b5563" : "#ffffff"} duration={1}>
                  <section>
                        {/* Desktop View */}
                        {isDesktop && 
                              <div className="hidden md:block space-y-8 fade-in">
                                    <div className="flex flex-col gap-5 mt-2">

                                          <Suspense fallback={null}>
                                                {/* Filter table*/}
                                                <Filter setArea={setArea} area={area}/>
                                                
                                                {/* Metric Cards*/}
                                                <AnalyticsMetricCards area={area}/>
                                          </Suspense>
                                          
                                          {/* Revenue and Checkin Forecast Chart*/}
                                          <div className="grid grid-cols-2 gap-5">
                                                <BigCard  title={'Checkin Data'} icon={<UserCheckIcon className="w-5 -h-5 text-blue-500"/> } label={`(${area})`}>
                                                      {isForecastChartLoading ?(
                                                            <Skeleton height="95%" width="100%" className="rounded-xl"/>
                                                      ): (
                                                            <div className="relative h-[48vh] mt-1 bg-stone-50 dark:bg-stone-800 p-2 rounded-xl">
                                                                  <canvas ref={checkInCanvas} />
                                                            </div>
                                                      )}
                                                </BigCard>

                                                {/* Revenue Forecast Chart*/}
                                                <BigCard   title={'Revenue Data'} icon={<DollarSignIcon className="w-5 -h-5 text-blue-500"/> } label={`(${area})`}>
                                                      {isForecastChartLoading ?(
                                                            <Skeleton height="95%" width="100%" className="rounded-xl"/>
                                                      ): (
                                                            <div className="relative h-[48vh] mt-1 bg-stone-50 dark:bg-stone-800 p-2 rounded-xl">
                                                                  <canvas ref={revenueCanvas} />
                                                            </div>
                                                      )}
                                                </BigCard>
                                          </div>
                                    </div>

                                    <StatsCharts/>
                              </div>
                        }

                        {/* Mobile View */}
                        {!isDesktop && 
                              <div className="block md:hidden ">
                                    {/* Performance Overview */}
                                    {selectedButton === 'Performance' && 
                                          <Suspense fallback={<LoadingSpinner />}>
                                                <div className="fade-in">
                                                      <Filter setArea={setArea} area={area}/>
                                                      
                                                      <div className="flex flex-col gap-5 mt-3">
                                                            {/* Metric Cards*/}
                                                            <AnalyticsMetricCards area={area}/>
                                                            {/* Revenue and Checkin Forecast Chart*/}
                                                            <div className="grid grid-cols-1 gap-5">
                                                                  {/* Checkin Forecast Chart*/}
                                                                        <BigCard  title={'Checkin Data'} icon={<UserCheckIcon className="w-5 -h-5 text-blue-500"/> } label={`(${area})`}>
                                                                              {isForecastChartLoading ?(
                                                                                    <Skeleton height="93%" width="100%" className="rounded-xl"/>
                                                                              ): (
                                                                                    <div className="relative h-[47vh] mt-1 bg-stone-50 dark:bg-stone-800 p-1 rounded-xl">
                                                                                          <canvas ref={checkInCanvas} />
                                                                                    </div>
                                                                              )}
                                                                        </BigCard>

                                                                        <BigCard   title={'Revenue Data'} icon={<DollarSignIcon className="w-5 -h-5 text-blue-500"/> } label={`(${area})`}>
                                                                              {isForecastChartLoading ?(
                                                                                    <Skeleton height="95%" width="100%" className="rounded-xl"/>
                                                                              ): (
                                                                                    <div className="relative h-[47vh] mt-1 bg-stone-50 dark:bg-stone-800 p-1 rounded-xl">
                                                                                          <canvas ref={revenueCanvas} />
                                                                                    </div>
                                                                              )}
                                                                        </BigCard>
                                                            </div>
                                                      </div>
                                                </div>
                                          </Suspense>
                                    }
                                    
                                    {/* Trends & Forecast */}
                                    {selectedButton === 'Trends & Forecasts' && 
                                          <Suspense fallback={<LoadingSpinner/>}>
                                                <div className="fade-in">
                                                      <StatsCharts/>     
                                                </div>
                                          </Suspense>
                                    } 
                              </div>
                        }
                  </section>
            </SkeletonTheme>
      );
}

function createCheckinForecastChart({ canvas, data, isDarkMode }) {
      const textColor = isDarkMode ? "#e5e7eb" : "#1f2937";
      const gridColor = isDarkMode ? "#374151" : "#e5e7eb";

      // ======= DATA TRANSFORM =======
      const historicalDatesISO = data.historical.date.map(d =>
            new Date(d).toISOString().split("T")[0]
      );

      const forecastedDatesISO = data.forecasted.date.map(d =>
            new Date(d).toISOString().split("T")[0]
      );

      const allDatesISO = historicalDatesISO.concat(forecastedDatesISO);
      const historicalValues = data.historical.value.concat(new Array(data.forecasted.value.length).fill(null));
      const forecastValues = new Array(data.historical.value.length).fill(null).concat(data.forecasted.value);
      const displayLabels = allDatesISO.map(d =>
            new Date(d).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
            })
      );

      // ======= CHART =======
      return new Chart(canvas, {
            type: "line",
            data: {
            labels: displayLabels,
            datasets: [
                  {
                        label: "Historical Check-in",
                        data: historicalValues,
                        borderColor: "#16a34a",
                        backgroundColor: "rgba(22,163,74,0.25)",
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: 0,
                        spanGaps: false,   // 🔥 IMPORTANT
                        fill: true
                  },
                  {
                        label: "Forecasted Check-in",
                        data: forecastValues,
                        borderColor: "#2563eb",
                        backgroundColor: "rgba(37,99,235,0.25)",
                        borderDash: [8, 5],
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: 0,
                        spanGaps: false,   // 🔥 IMPORTANT
                        fill: true
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
                  backgroundColor: "#111827",
                  titleColor: "#FBBF24",
                  bodyColor: "#F9FAFB",
                  borderColor: "#374151",
                  borderWidth: 1,
                  padding: 10,
                  titleFont: { size: 23, weight: "bold" },
                  bodyFont: { size: 22 },
                  callbacks: {
                  label(ctx) {
                        return `${ctx.dataset.label}: ${ctx.parsed.y ?? "-"} Check-ins`;
                  }
                  }
                  }
            },
            scales: {
                  y: {
                  min: 0,
                  max: 50,
                  title: {
                  display: true,
                  text: "Check-in %",
                  color: textColor
                  },
                  ticks: { color: textColor },
                  grid: { color: gridColor }
                  },
                  x: {
                  ticks: {
                  color: textColor,
                  maxTicksLimit: 15,
                  autoSkip: true
                  },
                  grid: { display: false }
                  }
            }
            }
      });
}

function createRevenueForecastChart({ canvas, data, isDarkMode }) {
      const textColor = isDarkMode ? "#e5e7eb" : "#1f2937";
      const gridColor = isDarkMode ? "#374151" : "#e5e7eb";
    
      // ======= DATA TRANSFORM =======
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    
      const historicalRevenue = Array(12).fill(null);
      const forecastedRevenue = Array(12).fill(null);
    
      data.historical.month.forEach((m, i) => {
        historicalRevenue[m - 1] = data.historical.value[i];
      });
    
      data.forecasted.month.forEach((m, i) => {
            forecastedRevenue[m - 1] = data.forecasted.value[i];
      });

      // ======= CHART =======
      return new Chart(canvas, {
            type: "bar",
            data: {
            labels: months,
            datasets: [
                  {
                  label: "Historical Revenue (₱)",
                  data: historicalRevenue,
                  backgroundColor: "rgba(234,179,8,0.85)", // amber-500
                  borderRadius: 6
                  },
                  {
                  label: "Forecasted Revenue (₱)",
                  data: forecastedRevenue,
                  backgroundColor: "rgba(236,72,153,0.85)", // pink-500
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
                  label(ctx) {
                        return `${ctx.dataset.label}: ₱${Number(ctx.parsed.y ?? 0).toLocaleString()}`;
                  }
                  }
                  }
            },
            scales: {
                  y: {
                  beginAtZero: true,
                  max: 1_000_000,
                  title: {
                  display: true,
                  text: "Revenue (₱)",
                  color: textColor
                  },
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

