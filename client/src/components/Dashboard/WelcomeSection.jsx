import UserAvatar from "../ui/UserAvatar";

const WelcomeSection = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  };

  return (
    <section
      className="relative overflow-hidden rounded-2xl p-6 sm:p-8 mb-6 text-[var(--text-on-primary)] animate-fade-in"
      style={{ background: "var(--gradient-bg)" }}
    >
      <div className="relative z-10 flex items-center gap-5 flex-wrap">
        <UserAvatar user={user} size="lg" className="border-4 border-white/40" />
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">
            {getGreeting()}, {user?.fullname || user?.username}!
          </h1>
          <p className="opacity-90 text-sm mt-1">{user?.email}</p>
          <p className="opacity-75 text-sm">@{user?.username}</p>
        </div>
      </div>
      <div className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none" />
    </section>
  );
};

export default WelcomeSection;
