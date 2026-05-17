// app/member/profile/ProfileCard.tsx
import Image from "next/image";

type Profile = {
  name: string;
  email?: string;
  phone?: string;
  bloodGroup?: string;
  jerseySize?: string;
  jerseyNumber?: string;
  address?: string;
  bio?: string;
  imageUrl?: string;
  footballPosition?: string;
  cricketRole?: string;
  rating?: number;
  teamCategory?: string;
  playsFootball?: boolean;
  playsCricket?: boolean;
};

export default function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <div className="min-h-screen bg-[#242b31] bg-[radial-gradient(#3a434b_1px,transparent_1px)] bg-size-[18px_18px] p-6 flex justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

        {/* Left Player Card */}
        <div className="relative overflow-hidden rounded-2xl bg-[#111820] text-white shadow-2xl min-h-[680px]">
          <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-purple-600/60" />

          <div className="relative z-10 flex items-center justify-between p-5">
            <h1 className="text-xl font-bold">{profile.name}</h1>
            <span className="text-sm bg-white/10 px-3 py-1 rounded-full">
              {profile.teamCategory}
            </span>
          </div>

          <div className="relative z-10 px-6">
            <div className="inline-block rounded-lg bg-white/10 px-4 py-2 font-bold mb-4">
              {profile.footballPosition || profile.cricketRole || "PLAYER"}
            </div>

            <div className="relative h-[430px]">
              <Image
                src={profile.imageUrl || "/default-player.png"}
                alt={profile.name}
                fill
                className="object-cover object-top"
              />
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
            <div className="rounded-2xl bg-black/50 backdrop-blur-md p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Jersey</p>
                <h2 className="text-3xl font-black">
                  #{profile.jerseyNumber || "00"}
                </h2>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-300">Rating</p>
                <h2 className="text-3xl font-black">
                  {profile.rating || 0}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Right Info Panel */}
        <div className="overflow-hidden rounded-2xl bg-[#121a21] text-white shadow-2xl">
          <div className="relative h-64">
            <Image
              src={profile.imageUrl || "/default-player.png"}
              alt={profile.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#121a21] to-transparent" />
          </div>

          <div className="p-7 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-5">Statistics</h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                <Stat label="Rating" value={profile.rating || 0} />
                <Stat label="Jersey" value={`#${profile.jerseyNumber || "00"}`} />
                <Stat label="Blood" value={profile.bloodGroup || "-"} />
                <Stat label="Size" value={profile.jerseySize || "-"} />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Profile</h2>

              <p className="text-gray-300 leading-7">
                {profile.bio ||
                  `${profile.name} is a club member who ${
                    profile.playsFootball ? "plays football" : ""
                  } ${
                    profile.playsCricket ? "and cricket" : ""
                  }. Position: ${profile.footballPosition || "N/A"}.`}
              </p>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Info label="Email" value={profile.email} />
              <Info label="Phone" value={profile.phone} />
              <Info label="Address" value={profile.address} />
              <Info label="Role" value={profile.cricketRole || profile.footballPosition} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <h3 className="text-3xl font-black">{value}</h3>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-4">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}