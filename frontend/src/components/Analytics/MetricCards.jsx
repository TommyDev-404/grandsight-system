import { lazy } from "react";
import { useAnalyticMetric } from "../../hooks/analyticsQueries";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDarkMode } from "../../context/DarkModeContext";
import {
      ArrowDownLeft,
      ArrowUpRight,
      Building2Icon,
      CalendarArrowUpIcon,
      CalendarCogIcon,
      TargetIcon,
} from "lucide-react";

const Card = lazy(() => import("../../shared/Cards"));

const formatCurrency = (value) => {
      if (value === null || value === undefined) return "--";
      return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
      }).format(Number(value));
};

const formatPercent = (value) => {
      if (value === null || value === undefined) return "--";
      return `${Number(value)}%`;
};

function MetricCard({ title, icon, iconBg, current, change, suffix = "", compareText, isLoading }) {
      const isPositive = Number(change ?? 0) > 0;

      return (
            <Card title={title} icon={icon} iconBg={iconBg}>
                  {/* Main Value */}
                  <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mt-2">
                        {isLoading ? (
                              <Skeleton height={28} width={120} />
                        ) : (
                              `${current}${suffix}`
                        )}
                  </p>

                  {/* Change Row */}
                  <div className="flex items-center gap-1 text-sm mt-1">
                        {isLoading ? (
                              <Skeleton height={16} width={160} />
                        ) : (
                              <>
                                    {isPositive ? (
                                          <ArrowUpRight className="w-5 h-5 text-green-500" />
                                    ) : (
                                          <ArrowDownLeft className="w-5 h-5 text-red-500" />
                                    )}

                                    <span className="text-gray-500 dark:text-gray-300">
                                          <label className={`font-semibold ${ isPositive ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                                                {isPositive ? "+" : ""}
                                                {formatPercent(change)}
                                          </label>{" "}
                                          {compareText}
                                    </span>
                              </>
                        )}
                  </div>
            </Card>
      );
}

export default function AnalyticsMetricCards({ area }) {
      const { currentMode } = useDarkMode();
      const { data: metricData, isLoading } = useAnalyticMetric(area);

      return (
            <SkeletonTheme 
                  baseColor={currentMode === 'dark' ? "#374151" : "#e5e7eb"}
                  highlightColor={currentMode === 'dark' ? "#4b5563" : "#ffffff"} 
                  duration={1}
            >
                  <div className="grid md:grid-cols-4 grid-1 gap-3">
                        <MetricCard
                              title="Daily Occupancy"
                              icon={ <Building2Icon className="w-3 h-3 md:w-4 md:h-4 text-purple-500 dark:text-white" />}
                              iconBg="bg-purple-100 dark:bg-purple-500"
                              current={formatPercent(metricData?.occupancy?.current)}
                              change={metricData?.occupancy?.change}
                              compareText="vs Yesterday"
                              isLoading={isLoading}
                        />

                        <MetricCard
                              title="Today`s Revenue"
                              icon={<CalendarArrowUpIcon className="w-3 h-3 md:w-4 md:h-4 text-green-500 dark:text-white" />}
                              iconBg="bg-green-100 dark:bg-green-500"
                              current={formatCurrency(metricData?.daily_revenue?.current)}
                              change={metricData?.daily_revenue?.change}
                              compareText="vs Yesterday"
                              isLoading={isLoading}
                        />

                        <MetricCard
                              title="Monthly Revenue"
                              icon={<CalendarCogIcon className="w-3 h-3 md:w-4 md:h-4 text-blue-500 dark:text-white" />}
                              iconBg="bg-blue-100 dark:bg-blue-500"
                              current={formatCurrency(metricData?.monthly_revenue?.current)}
                              change={metricData?.monthly_revenue?.change}
                              compareText="vs Target"
                              isLoading={isLoading}
                        />

                        <Card
                              title="Target Revenue"
                              icon={<TargetIcon className="w-3 h-3 md:w-4 md:h-4 text-red-500 dark:text-white" />}
                              iconBg="bg-red-100 dark:bg-red-500"
                        >
                              <p className="text-2xl  md:text-3xl font-bold text-gray-800 dark:text-white mb-5">
                                    {isLoading ? (
                                          <Skeleton height={28} width={140} duration={1.5} />
                                    ) : (
                                          formatCurrency(metricData?.target_revenue)
                                    )}
                              </p>
                        </Card>
                  </div>
            </SkeletonTheme>
      );
}
