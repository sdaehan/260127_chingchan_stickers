import { HomeCards } from "@/components/HomeCards";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-amber-50/90 via-orange-50/50 to-amber-100/80 px-4 py-8">
      <h1 className="mb-8 text-center text-2xl font-bold text-amber-900 sm:text-3xl">
        우리 가족의 칭찬 스티커
      </h1>
      <HomeCards />
    </div>
  );
}
