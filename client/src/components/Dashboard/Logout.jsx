import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slice/auth/authSlice";
import { logoutUserApi } from "../../redux/slice/auth/authThunk";
import { useEffect } from "react";

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const runLogout = async () => {
      try {
        await dispatch(logoutUserApi()).unwrap();
      } catch {
        // Still clear local session if API call fails
      }
      dispatch(logoutUser());
      sessionStorage.removeItem("dashboardTab");
      window.location.href = "/login";
    };
    runLogout();
  }, [dispatch]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl font-bold text-gray-700 animate-pulse">Logging out...</h1>
    </div>
  );
};

export default Logout;
