import { AppCard } from "@/components/AppCard";
import { SpotlightSearch } from "@/components/SpotlightSearch";
import { TopBar } from "@/components/TopBar";
import config from "@/config/services.json";

export default function Home() {
  return (
    <>
      {/* Full-screen Background Wallpaper (Unsplash free) */}
      <div
        className="bg-wallpaper"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&q=80')`,
        }}
      />

      <main className="relative z-10 min-h-screen flex flex-col">
        {/* ═══════ Top Bar (macOS-style) ═══════ */}
        <TopBar />

        {/* ═══════ Main Content ═══════ */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          {/* Hero Section */}
          <div className="text-center mb-14 space-y-4">
            <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
              <span className="text-gradient">Your Lab.</span>
              <br />
              <span className="text-white/90">One Place.</span>
            </h2>
            <p className="text-white/30 text-[15px] font-medium max-w-md mx-auto leading-relaxed">
              Access all your self-hosted applications from a single, beautiful dashboard.
            </p>
          </div>

          {/* App Grid */}
          <div className="w-full max-w-5xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {config.services.map((service, index) => (
                <AppCard
                  key={service.name}
                  name={service.name}
                  url={service.url}
                  icon={service.icon}
                  description={service.description}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ═══════ Footer ═══════ */}
        <footer className="py-6 text-center">
          <p className="text-[11px] text-white/15 font-medium">
            Home Lab OS • Built with Next.js & Tailwind
          </p>
        </footer>

        {/* Spotlight Search */}
        <SpotlightSearch />
      </main>
    </>
  );
}
