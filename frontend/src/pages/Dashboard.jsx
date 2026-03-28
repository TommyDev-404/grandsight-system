import { lazy, Suspense, useEffect} from "react";
import useDesktop from "../hooks/useDesktop";
import { useGlobalContext } from "../context/GlobalStorageContext";
import { useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from '../shared/LoadingSpinner';
import { 
	useLiveOperational,
	useTodayActivity,
	useBookingCount,
	useUpcomingBooking,
	useRoomOverviewMetric,
	useRoomOverviewAreas,
	useBookingTrend,
	useBookingStats,
	dashboardQueries
} from "../hooks/dashboardQueries";

const LiveOperationalMetric = lazy(() => import("../components/Dashboard/LiveOperational"));
const TodaysActivity = lazy(() => import("../components/Dashboard/TodayActivity"));
const BookingsOverview = lazy(() => import("../components/Dashboard/BookingsOverview"));
const RoomOverview = lazy(() => import("../components/Dashboard/RoomOverview"));
const Charts = lazy(() => import("../components/Dashboard/Charts"));


export default function Dashboard() {
	const isDesktop = useDesktop();
	const { selectedButton, setSelectedButton, setButtons } = useGlobalContext();
	const queryClient = useQueryClient();
	
	useEffect(() =>  {
		setButtons(['metrics', 'bookings', 'area', 'charts']);
            setSelectedButton('metrics')
	}, []);

	useEffect(() => {
		async function prefetchDashboard() {
			try {
				await Promise.all([
					queryClient.prefetchQuery(dashboardQueries.liveOperation()),
					queryClient.prefetchQuery(dashboardQueries.todayActivity()),
					queryClient.prefetchQuery(dashboardQueries.bookingTrend()),
					queryClient.prefetchQuery(dashboardQueries.bookingStats()),
					queryClient.prefetchQuery(dashboardQueries.roomOverviewMetric()),
					queryClient.prefetchQuery(dashboardQueries.roomOverviewAreas()),
					queryClient.prefetchQuery(dashboardQueries.bookingCount("all", "today")), // example
					queryClient.prefetchQuery(dashboardQueries.upcomingBooking("all", "today")), // example
				]);
			} catch (error) {
				console.error("Prefetch failed:", error);
			}
		}

		prefetchDashboard();
	}, []);
	
	// handle showing the skeloton on first mount
	const { data: liveOperationData, isLoading: liveOperationLoading } = useLiveOperational();
	const { data: todayActivityData, isLoading: todayActivityLoading } = useTodayActivity();
	const { data: bookingCountData, isLoading: bookingCountLoading } = useBookingCount();
	const { data: upcomingBookingData, isLoading: upcomingBookingLoading } = useUpcomingBooking("checkout", "tomorrow");
	const { data: roomOverviewMetricData, isLoading: roomOverviewMetricLoading } = useRoomOverviewMetric();
	const { data: roomOverviewAreasData, isLoading: roomOverviewAreasLoading } = useRoomOverviewAreas();
	const { data: bookingTrendData, isLoading: bookingTrendLoading } = useBookingTrend();
	const { data: bookingStatsData, isLoading: bookingStatsLoading } = useBookingStats();

	const pageLoading = 
		liveOperationLoading ||
		todayActivityLoading ||
		bookingCountLoading ||
		upcomingBookingLoading ||
		roomOverviewMetricLoading ||
		roomOverviewAreasLoading ||
		bookingTrendLoading ||
		bookingStatsLoading;

	if (pageLoading)  return <LoadingSpinner/>;
	
      return (
		<section>
			{/* Desktop View */}
			{isDesktop && (
				<Suspense fallback={<LoadingSpinner />}>
					<div className="space-y-5 hidden md:block fade-in">
						<LiveOperationalMetric/>
						<TodaysActivity/>
						<BookingsOverview/>
						<RoomOverview/>
						<Charts/>
					</div>
				</Suspense>
			)}

			{/* Mobile VIew */}
			{!isDesktop && (
				<div className="space-y-8 md:hidden scrollbar-hide">
					{selectedButton === "metrics" && (
						<div className="fade-in">
							<Suspense fallback={<LoadingSpinner />}>
								<LiveOperationalMetric />
								<TodaysActivity />
							</Suspense>
						</div>
					)}
				
					{selectedButton === "bookings" && (
						<Suspense fallback={<LoadingSpinner />}>
							<div className="fade-in">
								<BookingsOverview />
							</div>
						</Suspense>
					)}
				
					{selectedButton === "area" && (
						<Suspense fallback={<LoadingSpinner />}>
							<div className="fade-in">
								<RoomOverview />
							</div>
						</Suspense>
					)}
				
					{selectedButton === "charts" && (
						<Suspense fallback={<LoadingSpinner />}>
							<div className="fade-in">
								<Charts />
							</div>
						</Suspense>
					)}
				
				</div>
			)}
		</section>
      );
}


/*

*/