"use client";
import Leaf from "@/components/assets/Leaf";
import LeftBottom from "@/components/assets/LeftBottom";
import MerryChris from "@/components/assets/MerryChris";
import RightBottom from "@/components/assets/RightBottom";
import Top from "@/components/assets/Top";
import Twitter from "@/components/assets/Twitter";
import { Input } from "@/components/ui/input";
import { fetchGitHubUser } from "@/lib/fetchGitHubUser";
import Link from "next/link";
import { useRef, useState } from "react";
import ProfileDetails from "./ProfileDetails";
import Loader from "@/components/Loader";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";

const Hero = () => {
  const [userName, setUserName] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [profileData, setProfileData] = useState<{
    name: string;
    src: string;
    bio: string;
    totalStars: number;
    totalRepos: number;
    longestStreak: number;
    prsMerged: number;
    totalCommits: number;
  }>({
    name: "",
    src: "",
    bio: "",
    totalStars: 0,
    totalRepos: 0,
    longestStreak: 0,
    prsMerged: 0,
    totalCommits: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await fetchGitHubUser(userName);

    if (result === null || result.error) {
      setError(result?.error || "An unexpected error occurred.");
      setShowProfile(false);
      setLoading(false);
      return;
    }

    const { userData, stats } = result;

    if (userData && stats) {
      setProfileData({
        name: userData?.name || "No name available",
        src: userData?.avatar_url || "",
        bio: userData?.bio || "No bio available",
        totalStars: stats.totalStars || 0,
        totalRepos: stats.totalRepos || 0,
        longestStreak: stats.longestStreak || 0,
        prsMerged: stats.totalMergedPRs || 0,
        totalCommits: stats.totalCommits || 0,
      });

      setShowProfile(true);
    } else {
      setError("Failed to fetch valid user data.");
      setShowProfile(false);
    }
    setLoading(false);
  };

  const handleDownload = async () => {
    if (profileRef.current) {
      try {
        const dataUrl = await toPng(profileRef.current);
        saveAs(dataUrl, "profile.png");
      } catch (error) {
        console.error("Error generating image:", error);
      }
    }
  };

  const handleShare = () => {
    const twitterUrl = `https://x.com/compose/post?text=Check%20out%20my%20cool%20Christmas%20GitHub%20profile!%20%0ALink:%20https://git-christmas.vercel.app/`;
    window.open(twitterUrl, "_blank");
  };

  return (
    <section className="z-10 h-full w-full overflow-hidden px-4 py-4 md:w-fit">
      <div
        ref={profileRef}
        className="scroll relative z-0 flex h-full min-h-screen flex-col items-center justify-start overflow-hidden rounded-3xl border-2 border-[#ECECEC] bg-[#ECECEC] text-center text-foreground md:min-w-[600px]"
      >
        <Top />
        <div className="mt-24">
          <MerryChris />
        </div>

        {loading && <Loader />}
        {!showProfile && !loading && (
          <div className="size-full">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center gap-2 px-4 md:px-24"
            >
              <Input
                type="text"
                name="username"
                placeholder="Enter GitHub username"
                className="w-full max-w-2xl rounded-lg border border-neutral-300 bg-white p-2 text-sm"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <button
                type="submit"
                className="cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-white"
              >
                Show My Profile
              </button>
            </form>
            {error && <p className="mt-2 text-red-500">{error}</p>}
          </div>
        )}
        {showProfile && (
          <div>
            {loading ? (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-800 bg-opacity-50">
                <Loader />
              </div>
            ) : (
              <ProfileDetails
                name={profileData.name}
                src={profileData.src}
                bio={profileData.bio}
                totalStars={profileData.totalStars}
                totalRepos={profileData.totalRepos}
                longestStreak={profileData.longestStreak}
                prsMerged={profileData.prsMerged}
                totalCommits={profileData.totalCommits}
                error={error}
              />
            )}
          </div>
        )}

        <div className="absolute -bottom-[0%] left-0 -z-10 opacity-30 md:opacity-100">
          <LeftBottom />
        </div>
        <div className="absolute -bottom-[0%] right-0 -z-10 opacity-30 md:opacity-100">
          <RightBottom />
        </div>
      </div>
      {showProfile && (
        <div className="mt-8 flex flex-row items-center justify-center gap-2 rounded-xl border-2 border-black/20 bg-black/70 px-4 py-2 backdrop-blur-[12px]">
          <span
            className="cursor-pointer text-nowrap text-white/80 hover:underline"
            onClick={handleDownload}
          >
            Download
          </span>
          <div className="h-[1px] w-full bg-white/20" />
          <span className="text-nowrap font-[400] text-white/20">OR</span>
          <div className="h-[1px] w-full bg-white/20" />
          <span
            className="cursor-pointer text-nowrap text-white/80 hover:underline"
            onClick={handleShare}
          >
            Share on X
          </span>
        </div>
      )}
      <div className="mt-8 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-black/20 bg-black/70 py-2 backdrop-blur-[12px]">
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
