import LargeBell from "@/components/assets/LargeBell";
import Leaf from "@/components/assets/Leaf";
import LeftBottom from "@/components/assets/LeftBottom";
import MerryChris from "@/components/assets/MerryChris";
import PfpTop from "@/components/assets/PfpTop";
import RightBottom from "@/components/assets/RightBottom";
import Top from "@/components/assets/Top";
import Twitter from "@/components/assets/Twitter";
import { Input } from "@/components/ui/input";
import { fetchGitHubUser } from "@/lib/fetchGitHubUser";
import { getTotalCommits } from "@/lib/getTotalCommits";
import Image from "next/image";
import Link from "next/link";

// Function to fetch user data
export const getServerSideProps = async (context: any) => {
  const username = context.query.username ?? "Lokendrakushwah12";
  const { userData, error } = await fetchGitHubUser(username);
  const totalCommits = error ? null : await getTotalCommits(username);

  return {
    props: {
      userData,
      error,
      totalCommits,
      username,
    },
  };
};
const Hero = ({ userData, error, totalCommits, username }: any) => {
  return (
    <section className="z-10 h-full w-full overflow-hidden px-4 py-4 md:w-fit">
      <div className="scroll relative z-0 flex h-full flex-col items-center justify-start overflow-y-auto overflow-x-hidden rounded-3xl border border-[#ECECEC] bg-[#ECECEC] text-center text-foreground">
        <Top />
        <div className="mt-24">
          <MerryChris />
        </div>
        <div>
          {/* Input form */}
          <form
            method="get"
            action="/"
            className="flex flex-col items-center gap-2"
          >
            <Input
              type="text"
              name="username"
              placeholder="Enter GitHub username"
              defaultValue={username}
              className="w-xl w-full rounded-lg border border-neutral-300 p-2 text-sm"
            />
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-white"
            >
              Show My Profile
            </button>
          </form>
        </div>
        {!error ? (
          <>
            <div className="pointer-events-none -mt-8">
              <PfpTop />
            </div>
            <div className="relative">
              <svg
                width="9"
                height="9"
                viewBox="0 0 9 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="pointer-events-none absolute -top-2 left-1/2 -z-10 -translate-x-1/2"
              >
                <path
                  d="M0.5 4.25641C0.5 2.04727 2.29086 0.256409 4.5 0.256409V0.256409C6.70914 0.256409 8.5 2.04727 8.5 4.25641V8.25641H0.5V4.25641Z"
                  fill="#FF1639"
                />
              </svg>

              <Image
                src={userData ? userData.avatar_url : "/"}
                alt={userData ? userData.name : "GitHub User"}
                width={84}
                height={84}
                className="rounded-full border-2 border-[#FF1639]"
              />
            </div>
            <p className="max-w-xl text-balance text-base text-foreground sm:text-xl md:text-wrap">
              {userData ? userData.name : "Anonymous"}
            </p>
            <p className="max-w-xl text-balance text-sm text-muted-foreground md:text-wrap">
              {userData
                ? userData.bio
                : "Merry Christmas to all the developers out there! 🎄"}
            </p>
            <div className="relative">
              <p className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 text-xl text-[#FFCD9B] sm:text-2xl md:text-wrap">
                <span className="flex flex-col items-center justify-center">
                  Total commits
                  <span>{totalCommits || "100+"}</span>
                </span>
              </p>
              <LargeBell />
            </div>
            <div className="absolute -bottom-[41%] left-0 -z-10 opacity-30 md:opacity-100">
              <LeftBottom />
            </div>
            <div className="absolute -bottom-[41%] right-0 -z-10 opacity-30 md:opacity-100">
              <RightBottom />
            </div>
          </>
        ) : (
          <p className="text-red-500">
            {error || "Failed to fetch user data. Please try again!"}
          </p>
        )}
        <Link
          target="_blank"
          rel="noreferrer"
          href="https://github.com/Lokendrakushwah12/git-christmas"
        >
          <div
            className="inline-flex items-center gap-2 text-sm font-[600] text-[#557E80] hover:underline"
            aria-hidden="true"
          >
            <Leaf />
            Star on GitHub
          </div>
        </Link>
        <Link target="_blank" rel="noreferrer" href="https://x.com/Lokendratwt">
          <div
            className="inline-flex items-center gap-2 text-sm font-[600] text-[#C64450]"
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
