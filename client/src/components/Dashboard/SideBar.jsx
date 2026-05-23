import { Link } from "react-router-dom";
import { HiHome, HiCloudUpload, HiCog, HiLogout } from "react-icons/hi";
import logo from "../../assets/logo.png";

const tabs = [
  { name: "Overview", icon: HiHome, id: "home" },
  { name: "Upload", icon: HiCloudUpload, id: "upload" },
  { name: "Settings", icon: HiCog, id: "settings" },
  { name: "Logout", icon: HiLogout, id: "logout" },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen, setActiveTab, activeTab }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-out md:translate-x-0 md:static md:inset-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        border-r border-[var(--border-color)] bg-[var(--bg-color)] pt-20 md:pt-24`}
    >
      <div className="px-4 pb-4 hidden md:block">
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src={logo} alt="" className="h-8 w-8 rounded-lg" />
          <span className="font-bold text-[var(--text-color)]">PasteBox</span>
        </Link>
      </div>
      <nav className="flex flex-col gap-1 p-4 pt-0">
        <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--secondary-text)]">Menu</p>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 w-full text-left
                ${active
                  ? "text-white shadow-glow"
                  : "text-[var(--secondary-text)] hover:bg-[var(--hover-bg-color)] hover:text-[var(--text-color)]"
                }`}
              style={active ? { background: "var(--primary-gradient)" } : undefined}
            >
              <Icon className="text-lg shrink-0" />
              {tab.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
