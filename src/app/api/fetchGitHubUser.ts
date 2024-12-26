import { fetchCommitDates } from "./fetchCommitDates";
import { longestStreakFn } from "./longestStreakFn";
import { searchPullRequests } from "./searchPullRequests";

type GitHubStats = {
  totalStars: number;
  totalRepos: number;
  longestStreak: number;
  totalMergedPRs: number;
  totalCommits: number;
  totalForks: number;
};

type GitHubResult = {
  userData: any;
  stats: GitHubStats | null;
  error: string | null;
};

let cache: {
  data: GitHubResult | null;
  expiration: number | null;
} = {
  data: null,
  expiration: null,
};

interface PullRequest {
  merged_at: string | null;
}

export const fetchGitHubUser = async (username: string) => {
  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN as string;

  if (!GITHUB_TOKEN) {
    return {
      userData: null,
      stats: null,
      error: "GitHub token is not provided.",
    };
  }

  if (cache.expiration && cache.expiration > Date.now()) {
    console.log("Returning cached data");
    return cache.data;
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  };

  try {
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`,
      { headers },
    );

    if (!userResponse.ok) {
      return {
        userData: null,
        stats: null,
        error: `Failed to fetch user data. Status: ${userResponse.status}`,
      };
    }

    const userData = await userResponse.json();

    // Fetch repositories
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      { headers },
    );

    if (!reposResponse.ok) {
      return {
        userData,
        stats: null,
        error: `Failed to fetch repository data. Status: ${reposResponse.status}`,
      };
    }

    // TOTAL COMMITS
    const reposData = await reposResponse.json();

    const oneYeay = new Date();
    oneYeay.setDate(oneYeay.getDate() - 365);
    const dateFilter = oneYeay.toISOString().split("T")[0];

    const commitsResponse = await fetch(
      `https://api.github.com/search/commits?q=author:${username}+committer-date:>=${dateFilter}`,
      {
        headers: {
          ...headers,
          Accept: "application/vnd.github.cloak-preview+json",
        },
        next: { revalidate: 3600 },
      },
    );

    const commitsData = await commitsResponse.json();
    const totalCommits = commitsData.total_count;

    // LONGEST STREAK
    const commitsByRepoArray = await fetchCommitDates(username);
    const allCommitDates = commitsByRepoArray.flatMap((repo: any) =>
      Array.isArray(repo.commitDates)
        ? repo.commitDates.map((date: string) => new Date(date))
        : [],
    );
    const sortedCommits = allCommitDates.sort(
      (a: any, b: any) => a.getTime() - b.getTime(),
    );
    console.log(sortedCommits);
    let { longestStreak } = await longestStreakFn(sortedCommits);

    // PRs MERGED
    const totalMergedPRs = await searchPullRequests(username);

    // TOTAL STARS & FORKS
    const totalStars = reposData.reduce(
      (acc: number, repo: any) => acc + repo.stargazers_count,
      0,
    );

    const totalForks = reposData.reduce(
      (acc: number, repo: any) => acc + repo.forks_count,
      0,
    );

    const result = {
      userData,
      stats: {
        totalStars,
        totalRepos: reposData.length,
        longestStreak,
        totalMergedPRs,
        totalCommits,
        totalForks,
      },
      error: null,
    };

    // Update the cache
    cache = {
      data: result,
      expiration: Date.now() + 3600000,
    };

    return result;
  } catch (error) {
    return {
      userData: null,
      stats: null,
      error: (error as Error).message || "An unexpected error occurred.",
    };
  }
};
