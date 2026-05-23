import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/slice/auth/authThunk";
import WelcomeSection from "./WelcomeSection";
import { getUserId } from "../../utils/normalizeUser";
import { HiUpload, HiDownload, HiFilm, HiPhotograph, HiDocument } from "react-icons/hi";

const StatsGrid = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const hasFetched = useRef(false);

  useEffect(() => {
    const userId = getUserId(user);
    if (userId && !hasFetched.current) {
      dispatch(getUser(userId));
      hasFetched.current = true;
    }
  }, [user, dispatch]);

  const cards = [
    { title: "Total uploads", value: user?.totalUploads ?? 0, icon: HiUpload },
    { title: "Total downloads", value: user?.totalDownloads ?? 0, icon: HiDownload },
    { title: "Videos", value: user?.videoCount ?? 0, icon: HiFilm },
    { title: "Images", value: user?.imageCount ?? 0, icon: HiPhotograph },
    { title: "Documents", value: user?.documentCount ?? 0, icon: HiDocument },
  ];

  return (
    <div>
      <WelcomeSection user={user} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="glass-card p-5 hover:shadow-glow transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-white"
                  style={{ background: "var(--primary-gradient)" }}
                >
                  <Icon className="text-lg" />
                </div>
              </div>
              <p className="mt-4 text-2xl font-bold text-[var(--text-color)]">{card.value}</p>
              <p className="text-sm text-[var(--secondary-text)] mt-0.5">{card.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatsGrid;
