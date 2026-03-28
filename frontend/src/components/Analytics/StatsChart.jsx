import { useRef, useEffect, useState } from "react";
import { ArrowBigUpDashIcon, Clock } from "lucide-react";
import { useAnalyticStatistics } from "../../hooks/analyticsQueries";
import { useDarkMode } from "../../context/DarkModeContext";
import { useGlobalContext } from "../../context/GlobalStorageContext";
import Skeleton from "react-loading-skeleton";
import BigCard from "../../shared/BigCard";
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
      Tooltip, Legend, 
      PieController, 
      Filler
} from "chart.js";

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

export default function StatsCharts() {
      const { selectedButton } = useGlobalContext();
      const { currentMode } = useDarkMode();
      const isDark = currentMode === "dark";

      const occupancyRef = useRef();
      const occupancyCanvas = useRef();
      const heavyMonthRef = useRef();
      const heavyMonthCanvas = useRef();
      const bookedAreaRef = useRef();
      const bookedAreaCanvas = useRef();

      const { data: statsData, isLoading: statsDataLoading } = useAnalyticStatistics();
      const [chartsReady, setChartsReady] = useState(false);

      const isLoading = statsDataLoading || !chartsReady;

      // Small delay to ensure canvas refs exist before drawing charts
      useEffect(() => {
      const timer = setTimeout(() => setChartsReady(true), 200);
      return () => clearTimeout(timer);
      }, []);

      // ====== Initialize Charts ======
      useEffect(() => {
      if (!chartsReady || !statsData || !occupancyCanvas.current || !heavyMonthCanvas.current || !bookedAreaCanvas.current) return;

      // Occupancy Forecast
      occupancyRef.current?.destroy();
      occupancyRef.current = createOccupancyForecastChart({
            canvas: occupancyCanvas.current,
            data: statsData.occupancy_forecast,
            isDarkMode: isDark,
      });

      // Heavy Guest Month
      heavyMonthRef.current?.destroy();
      heavyMonthRef.current = createHeavyGuestMonthChart({
            canvas: heavyMonthCanvas.current,
            data: statsData.heavy_guest_month,
            isDarkMode: isDark,
      });

      // Most Booked Area
      bookedAreaRef.current?.destroy();
      bookedAreaRef.current = createMostBookedAreaChart({
            canvas: bookedAreaCanvas.current,
            data: statsData.most_booked_area,
            isDarkMode: isDark,
      });

      return () => {
            occupancyRef.current?.destroy();
            occupancyRef.current = null;
            heavyMonthRef.current?.destroy();
            heavyMonthRef.current = null;
            bookedAreaRef.current?.destroy();
            bookedAreaRef.current = null;
      };
      }, [chartsReady, statsData, isDark, selectedButton]);

      return (
            <>
                  {/* Occupancy Forecast Chart */}
                  <BigCard title="Occupancy Forecast (%)" icon={<ArrowBigUpDashIcon className="w-5 h-5 text-blue-500" />} label="(All Resort Area)">
                        {isLoading ? (
                              <Skeleton height="95%" width="100%" className="rounded-xl" />
                        ) : (
                              <div className="relative h-[46vh] mt-4 bg-stone-50 dark:bg-stone-800 p-2 rounded-xl">
                                    <canvas ref={occupancyCanvas} />
                              </div>
                        )}
                  </BigCard>

                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
                        {/* Heavy Guest Month */}
                        <BigCard title="Heavy Guest Month" icon={<ArrowBigUpDashIcon className="w-5 h-5 text-blue-500" />} label="(Historical)" colSpan="md:col-span-4">
                              {isLoading ? (
                                    <Skeleton height="95%" width="100%" className="rounded-xl" />
                              ) : (
                                    <div className="relative h-[46vh] mt-4 bg-stone-50 dark:bg-stone-800 p-2 rounded-xl">
                                          <canvas ref={heavyMonthCanvas} />
                                    </div>
                              )}
                        </BigCard>

                        {/* Area Booking Data */}
                        <BigCard title="Area Booking Data" icon={<Clock className="w-5 h-5 text-blue-500" />} label="(Historical)" colSpan="md:col-span-2">
                              {isLoading ? (
                                    <Skeleton height="95%" width="100%" className="rounded-xl" />
                              ) : (
                                    <div className="relative h-[46vh] mt-4 bg-stone-50 dark:bg-stone-800 p-2 rounded-xl">
                                          <canvas ref={bookedAreaCanvas} />
                                    </div>
                              )}
                        </BigCard>
                  </div>
            </>
      );
}

// ======= Chart Creation Functions =======
function createOccupancyForecastChart({ canvas, data, isDarkMode }) {
      const textColor = isDarkMode ? "#E5E7EB" : "#111827";
      const gridColor = isDarkMode ? "#374151" : "#E5E7EB";

      const historicalDatesISO = data.historical.date.map(d => new Date(d).toISOString().split("T")[0]);
      const forecastedDatesISO = data.forecasted.date.map(d => new Date(d).toISOString().split("T")[0]);

      const allDatesISO = historicalDatesISO.concat(forecastedDatesISO);
      const historicalValues = data.historical.value.concat(new Array(data.forecasted.value.length).fill(null));
      const forecastValues = new Array(data.historical.value.length).fill(null).concat(data.forecasted.value);

      const displayLabels = allDatesISO.map(d =>
      new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      );

      return new Chart(canvas, {
            type: "line",
            data: {
                  labels: displayLabels,
                  datasets: [
                  {
                  label: "Historical Occupancy (%)",
                  data: historicalValues,
                  borderColor: "#3B82F6",
                  backgroundColor: "rgba(80,138,233,0.72)",
                  borderWidth: 2,
                  tension: 0.4,
                  pointRadius: 0,
                  spanGaps: true,
                  fill: true,
                  },
                  {
                  label: "Forecasted Occupancy (%)",
                  data: forecastValues,
                  borderColor: "#FBBF24",
                  backgroundColor: "rgba(224,240,6,0.68)",
                  borderDash: [8, 5],
                  borderWidth: 2,
                  tension: 0.4,
                  pointRadius: 0,
                  spanGaps: true,
                  fill: true,
                  },
                  ],
            },
            options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                  y: { min: 0, max: 100, title: { display: true, text: "Occupancy %", color: textColor }, ticks: { color: textColor }, grid: { color: gridColor } },
                  x: { ticks: { color: textColor, maxTicksLimit: 15, autoSkip: true }, grid: { display: false } },
                  },
                  plugins: {
                  legend: { labels: { color: textColor } },
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
                  bodyFont: { size: 25 },
                  callbacks: {
                        label(ctx) {
                        return `${ctx.dataset.label}: ${ctx.parsed.y ?? "-"}%`;
                        },
                  },
                  },
                  },
            },
      });
}

function createHeavyGuestMonthChart({ canvas, data, isDarkMode }) {
      const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const values = Array(12).fill(0);
      if (data.value && Array.isArray(data.value)) data.value.forEach((v, i) => i < 12 && (values[i] = v));

      const maxValue = Math.max(...values);
      const colors = values.map(v => (v === maxValue ? "#FBBF24" : "#1139e9ff"));

      return new Chart(canvas, {
            type: "bar",
            data: { labels, datasets: [{ data: values, backgroundColor: colors, borderRadius: 10 }] },
            options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                  legend: { display: false },
                  tooltip: {
                  backgroundColor: "#111827",
                  titleColor: "#FBBF24",
                  bodyColor: "#F9FAFB",
                  borderColor: "#374151",
                  borderWidth: 1,
                  padding: 10,
                  titleFont: { size: 23, weight: "bold" },
                  bodyFont: { size: 22 },
                  callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed.y} Guests` },
                  },
                  },
                  scales: {
                  x: { ticks: { color: isDarkMode ? "#F9FAFB" : "#374151" }, grid: { display: false } },
                  y: { beginAtZero: true, ticks: { color: isDarkMode ? "#E5E7EB" : "#374151" } },
                  },
            },
      });
}

function createMostBookedAreaChart({ canvas, data, isDarkMode }) {
      if (!canvas || !data) return;

      const areaValues = data.map(v => v.value);
      const areaLabels = data.map(area => area.area);
      const areaColors = ["#4F46E5", "#3B82F6", "#0EA5E9", "#14B8A6", "#22C55E", "#84CC16", "#FACC15", "#F97316", "#EF4444"];
      const areaBackgroundColors = areaLabels.map((_, i) => areaColors[i % areaColors.length]);

      return new Chart(canvas, {
            type: "pie",
            data: { labels: areaLabels, datasets: [{ data: areaValues, backgroundColor: areaBackgroundColors, borderWidth: 1 }] },
            options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                  legend: {
                  position: "bottom",
                  align: "center",
                  labels: { color: isDarkMode ? "#F9FAFB" : "#374151", font: { size: 10, weight: "500" } },
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
                  callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed || 0} Bookings` },
                  },
                  },
            },
      });
}