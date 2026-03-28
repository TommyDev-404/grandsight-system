
export default function ProtectedRoute({ children }) {
      const token = localStorage.getItem("access_token");

      if (!token) {
            window.location.href = "/not-authorized";
      }

      return children; // authorized
}
