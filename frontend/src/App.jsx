import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingSpinner from './shared/LoadingSpinner';

const RootLayout = lazy(() => import('./layouts/RootLayout'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Bookings = lazy(() => import('./pages/Bookings'));
const Housekeeping = lazy(() => import('./pages/Housekeeping'));
const RatesAndAvailability = lazy(() => import('./pages/Rates&Availability'));
const ReveneuManagement = lazy(() => import('./pages/RevenueManagement'));
const Accounting = lazy(() => import('./pages/Accounting'));
const StaffManagement = lazy(() => import('./pages/StaffManagement'));
const AdminProfile = lazy(() => import('./pages/AdminProfile'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const Login = lazy(() => import('./pages/Login'));
const NotAuthorizedPage = lazy(() => import('./pages/NotAuthorizedPage'));
const ProtectedRoute = lazy(() => import('./services/ProtectedRoute'));

export default function App() {
	return (	
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login/>}/>
				<Route path="/admin" 
					element={
						<Suspense fallback={null}>
							<ProtectedRoute>
								<RootLayout />
							</ProtectedRoute>
						</Suspense>
					}
				> {/* This is main path */}
					{/* Sub path used for navigating */}
					<Route path="dashboard" element={<Suspense fallback={null}><Dashboard /></Suspense>} />
					<Route path="analytics" element={<Suspense fallback={null}><Analytics /></Suspense>} />
					<Route path="bookings" element={<Suspense fallback={null}><Bookings /></Suspense>} />
					<Route path="housekeeping" element={<Suspense fallback={null}><Housekeeping /></Suspense>} />
					<Route path="rates&availability" element={<Suspense fallback={null}><RatesAndAvailability /></Suspense>} />
					<Route path="accounting" element={<Suspense fallback={null}><Accounting /></Suspense>} />
					<Route path="promo" element={<Suspense fallback={null}><ReveneuManagement /></Suspense>} />
					<Route path="staff" element={<Suspense fallback={null}><StaffManagement /></Suspense>} />
					<Route path="profile" element={<Suspense fallback={null}><AdminProfile /></Suspense>} />
				</Route>
				<Route path="*" element={<Suspense fallback={<LoadingSpinner />}><NotFoundPage /></Suspense>} /> {/* Responsible for showing the not found page if user try to search wrong path */}
				<Route path="/not-authorized" element={<NotAuthorizedPage />} />
			</Routes>
		</BrowserRouter>
	);
}
