import LargeBell from "@/components/assets/LargeBell";
import Leaf from "@/components/assets/Leaf";
import LeftBottom from "@/components/assets/LeftBottom";
import MerryChris from "@/components/assets/MerryChris";
import PfpTop from "@/components/assets/PfpTop";
import Top from "@/components/assets/Top";
import Twitter from "@/components/assets/Twitter";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="h-full py-4">
      <div className="scroll relative z-0 flex h-full flex-col items-center justify-start overflow-y-auto rounded-3xl border border-[#ECECEC] bg-[#ECECEC] text-center text-foreground">
        <Top />
        <div className="mt-24">
          <MerryChris />
        </div>
        <div className="-mt-8">
          <PfpTop />
        </div>
        <div className="relative">
          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute -top-2 left-1/2 -z-10 -translate-x-1/2"
          >
            <path
              d="M0.5 4.25641C0.5 2.04727 2.29086 0.256409 4.5 0.256409V0.256409C6.70914 0.256409 8.5 2.04727 8.5 4.25641V8.25641H0.5V4.25641Z"
              fill="#FF1639"
            />
          </svg>

          <Image
            src="/assets/hero.png"
            alt="git-christmas"
            width={84}
            height={84}
            className="rounded-full border-2 border-[#FF1639]"
          />
        </div>
        <p className="max-w-xl text-balance text-base text-muted-foreground sm:text-xl md:text-wrap">
          Lokendra Kushwah
        </p>
        <div className="relative">
          <p className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 text-balance text-base text-[#FFCD9B] sm:text-xl md:text-wrap">
            <span className="flex flex-col items-center justify-center">
              total commits
              <span>1000+</span>
            </span>
          </p>
          <LargeBell />
        </div>
        <div className="absolute bottom-0 left-0 -z-10">
          <LeftBottom />
        </div>
        <Link
          target="_blank"
          rel="noreferrer"
          href="https://github.com/Lokendrakushwah12/git-christmas"
        >
          <div
            className="inline-flex items-center gap-2 text-sm font-medium text-[#557E80] hover:underline"
            aria-hidden="true"
          >
            <Leaf />
            Star on GitHub
          </div>
        </Link>
        <Link target="_blank" rel="noreferrer" href="https://x.com/Lokendratwt">
          <div
            className="inline-flex items-center gap-2 text-sm font-medium text-[#C64450]"
            aria-hidden="true"
          >
            <Twitter />
            Built by <span className="hover:underline">Lokendra.</span>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
