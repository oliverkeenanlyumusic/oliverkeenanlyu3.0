import { api } from "@/trpc/server";
import { ReleasesGrid } from "@/app/_components/releases-grid";
import { Header } from "./_components/header";

export default async function Home() {
  const releases = await api.spotify.releases({ limit: 24 });

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/oliver-studio-1.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-black/60" />

      {/* content */}
      <div className="relative z-10 mx-auto max-w-10/12 px-6 py-16">
      <Header/>

        <ReleasesGrid releases={releases} />
      </div>
    </main>
  );
}

