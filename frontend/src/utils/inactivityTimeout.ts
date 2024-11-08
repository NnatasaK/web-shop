import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

const useInactivityTimeout = (timeout: number = 5 * 60 * 1000) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      alert("Session timed out due to inactivity. Please log in again.");
      logout();
      navigate("/login");
    };

    const resetTimer = () => {
      clearTimeout(window.inactivityTimer);
      window.inactivityTimer = setTimeout(handleLogout, timeout);
    };

    // Set the initial timeout
    window.inactivityTimer = setTimeout(handleLogout, timeout);

    // Reset timer on any of these events
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    // Clean up event listeners and timeout on unmount
    return () => {
      clearTimeout(window.inactivityTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [logout, navigate, timeout]);
};

export default useInactivityTimeout;
