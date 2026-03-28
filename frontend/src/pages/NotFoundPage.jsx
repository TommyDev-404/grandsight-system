
export default function NotFoundPage() {
      return (
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center flex flex-col items-center gap-4">
                  <h1 className="text-5xl font-bold text-red-500">404</h1>
                  <h2 className="text-3xl font-semibold">Oops! Page Not Found</h2>
                  <p className="text-gray-600">The page you are looking for does not exist.</p>
                  <button onClick={() => window.location.href = '/login'} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                        Go Back to Login
                  </button>
            </div>
      );
}
