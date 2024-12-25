import LargeBell from "@/components/assets/LargeBell";
import PfpTop from "@/components/assets/PfpTop";
import { PR } from "@/components/assets/PR";
import { Repo } from "@/components/assets/Repo";
import { Sock } from "@/components/assets/Sock";
import { Star } from "@/components/assets/Star";
import Image from "next/image";
import React from "react";

interface ProfileDetailsProps {
  name: string;
  src: string;
  bio: string;
  totalStars: number;
  totalRepos: number;
  longestStreak: number;
  prsMerged: number;
  totalCommits: number;
  error: string | null;
}

const ProfileDetails = ({
  name,
  src,
  bio,
  totalStars,
  totalRepos,
  longestStreak,
  prsMerged,
  totalCommits,
  error,
}: ProfileDetailsProps) => {
  return (
    <div className="relative flex flex-col items-center">
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
              src={src}
              alt={name}
              width={84}
              height={84}
              className="rounded-full border-2 border-[#FF1639]"
            />
          </div>
          <p className="max-w-xl text-balance text-base font-bold text-foreground sm:text-xl md:text-wrap">
            {name}
          </p>
          <p className="max-w-xl text-balance text-sm text-muted-foreground md:text-wrap">
            {bio}
          </p>
          <div className="absolute -mt-[23%] flex size-full items-center justify-center gap-4 pb-5">
            <div className="absolute left-2 flex flex-col space-y-6 md:left-[15%]">
              {/* 1 */}
              <div className="flex -rotate-3 flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-1">
                  <p className="text-2xl font-bold text-foreground/90 sm:text-3xl md:text-wrap">
                    {totalStars}
                  </p>
                  <Star />
                </div>
                <p className="text-sm font-bold text-[#d6995c]">Stars Earned</p>
              </div>
              {/* 2 */}
              <div className="flex rotate-3 flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-1">
                  <p className="text-2xl font-bold text-foreground/90 sm:text-3xl md:text-wrap">
                    {longestStreak}
                  </p>
                  <Sock />
                </div>
                <p className="text-sm font-bold text-[#AE444F]">
                  Longest Streak
                </p>
              </div>
            </div>
            <div className="absolute right-2 flex flex-col space-y-6 md:right-[15%]">
              {/* 3 */}
              <div className="flex rotate-3 flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-1">
                  <p className="text-2xl font-bold text-foreground/90 sm:text-3xl md:text-wrap">
                    {totalRepos}
                  </p>
                  <Repo />
                </div>
                <p className="text-sm font-bold text-[#AE444F]">Total Repo</p>
              </div>
              {/* 4 */}
              <div className="flex -rotate-3 flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-1">
                  <p className="text-2xl font-bold text-foreground/90 sm:text-3xl md:text-wrap">
                    {prsMerged}
                  </p>
                  <PR />
                </div>
                <p className="text-sm font-bold text-[#557E80]">PRs Merged</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <p className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 text-xl font-bold text-[#FFCD9B] sm:text-2xl md:text-wrap">
              <span className="flex flex-col items-center justify-center">
                Total Commits <span>{totalCommits}</span>
              </span>
            </p>
            <LargeBell />
          </div>
        </>
      ) : (
        <p className="text-red-500">{error}</p>
      )}
    </div>
  );
};

export default ProfileDetails;
