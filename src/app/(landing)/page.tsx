"use client";
import WholeBg from "@/components/assets/WholeBg";
import Hero from "./_components/Hero";

const HomePage = () => {
  return (
    <main className="mx-auto flex w-screen flex-col items-center justify-start overflow-hidden bg-[#E4E4E4]">
      <Hero />
      <div className="absolute -bottom-[41%] left-1/2 -z-0 -translate-x-1/2">
        <WholeBg />
      </div>
    </main>
  );
};

export default HomePage;
