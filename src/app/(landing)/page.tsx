import WholeBg from "@/components/assets/WholeBg";
import Hero from "./_components/Hero";

const HomePage = () => {
  return (
    <main className="mx-auto flex h-screen w-screen flex-col items-center justify-start overflow-hidden">
      <Hero />
      <div className="absolute bottom-0 left-0 -z-10">
        <WholeBg />
      </div>
    </main>
  );
};

export default HomePage;
