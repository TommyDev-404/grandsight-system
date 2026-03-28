
export default function NotAuthorizedPage() {
      const handleBackToLogin = () => {
            window.location.href = '/login';
      };

      return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
                  <div className="text-center">
                        <h1 className="text-6xl font-extrabold text-red-500 mb-4">403</h1>
                        <h2 className="text-3xl font-semibold mb-2 text-gray-800 dark:text-gray-200"> Oops! Access Denied</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">You don’t have permission to view this page.</p>
                        <button onClick={handleBackToLogin} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-normal text-sm rounded-sm transition">
                        Back to Login
                        </button>
                  </div>
            </div>
      );
}
