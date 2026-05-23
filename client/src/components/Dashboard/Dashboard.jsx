import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/slice/auth/authThunk";
import { getUserId } from "../../utils/normalizeUser";
import Header from "./Header";
import Sidebar from "./SideBar";
import StatsGrid from "./StatesGrid";
import UserProfile from "./UserProfile";
import UploadPage from "./FileUpload/UploadPage";
import FileShow from "./FileShow";
import Logout from "./Logout";
import DashboardFooter from "./DashboardFooter";
import Spinner from "../ui/Spinner";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(
    () => sessionStorage.getItem("dashboardTab") || "home"
  );

  useEffect(() => {
    sessionStorage.setItem("dashboardTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const userId = getUserId(user);
    if (userId) dispatch(getUser(userId));
  }, [dispatch, user?.id]);

  if (loading) {
    return (
      <div className="page-shell flex flex-col items-center justify-center gap-4 min-h-screen">
        <Spinner size="lg" />
        <p className="text-sm text-[var(--secondary-text)] animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page-shell min-h-screen flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}
      <div className="flex flex-col flex-1 min-w-0">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 pt-20 md:pt-24 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "upload" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-color)]">Upload files</h1>
                <p className="text-[var(--secondary-text)] mt-1">
                  Drag and drop files, add password or expiry, then share from your dashboard
                </p>
              </div>
              <UploadPage onUploadSuccess={() => setActiveTab("home")} />
            </div>
          )}
          {activeTab === "settings" && <UserProfile />}
          {activeTab === "logout" && <Logout />}
          {activeTab === "home" && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-color)]">Overview</h1>
                <p className="text-[var(--secondary-text)] mt-1">Your uploads and activity at a glance</p>
              </div>
              <StatsGrid />
              <FileShow />
            </div>
          )}
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
};

export default Dashboard;
