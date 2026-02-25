import { SpotlightSearch } from "@/components/SpotlightSearch";
import { TopBar } from "@/components/TopBar";
import { ServiceGrid } from "@/components/ServiceGrid";
import { Divider } from "@nextui-org/react";

export default function Home() {
  return (
    <>
      {/* Background Wallpaper */}
      <div
        className="bg-wallpaper"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&q=80')`,
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation */}
        <TopBar />

        {/* Main Content */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
          {/* Hero */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight dark:text-white text-gray-800">
              Your Lab. One Place.
            </h2>
            <p className="dark:text-white/70 text-gray-600 mt-3 text-base max-w-lg mx-auto">
              Access all your self-hosted services from a single, beautiful dashboard.
            </p>
          </div>

          <Divider className="mb-10 max-w-xs mx-auto" />

          {/* Dynamic App Grid */}
          <ServiceGrid />
        </main>

        {/* Footer */}
        <footer className="py-6 text-center">
          <p className="text-tiny text-default-300">
            Dash21 • Built with Next.js & NextUI
          </p>
        </footer>

        {/* Spotlight */}
        <SpotlightSearch />
      </div>
    </>
  );
}
