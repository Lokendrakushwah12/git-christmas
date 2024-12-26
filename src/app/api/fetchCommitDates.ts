interface CommitData {
  commitDates: string[];
  repoName: string;
}

interface StreakResult {
  longestStreak: number;
  currentStreak: number;
  startDate?: Date;
  endDate?: Date;
}

export async function fetchCommitDates(username: string): Promise<CommitData[]> {
  try {
    // First, fetch all repositories for the user
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`,
    );
    if (!response.ok) throw new Error("Failed to fetch repositories");

    const repos = await response.json();

    // Create an array of promises for fetching commits from each repo
    const commitPromises = repos.map(async (repo: any) => {
      try {
        const commitsResponse = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=100&author=${username}`,
        );

        if (!commitsResponse.ok)
          return { commitDates: [], repoName: repo.name };

        const commits = await commitsResponse.json();
        return {
          commitDates: commits.map((commit: any) => commit.commit.author.date),
          repoName: repo.name,
        };
      } catch (error) {
        console.error(`Error fetching commits for ${repo.name}:`, error);
        return { commitDates: [], repoName: repo.name };
      }
    });

    // Use Promise.all to fetch all commits concurrently
    return await Promise.all(commitPromises);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    throw error;
  }
}

function longestStreakFn(dates: Date[]): StreakResult {
  if (!dates.length) return { longestStreak: 0, currentStreak: 0 };

  // Sort dates in ascending order
  const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());

  let currentStreak = 1;
  let longestStreak = 1;
  let currentStart = sortedDates[0];
  let longestStart = sortedDates[0];
  let longestEnd = sortedDates[0];

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1] || "");
    const currentDate = new Date(sortedDates[i] || "");

    // Reset date times to start of day for comparison
    prevDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const diffDays =
      (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      currentStreak++;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
        longestStart = currentStart;
        longestEnd = currentDate;
      }
    } else if (diffDays > 1) {
      currentStreak = 1;
      currentStart = currentDate;
    }
  }

  return {
    longestStreak,
    currentStreak,
    startDate: longestStart,
    endDate: longestEnd,
  };
}

// Usage example
async function calculateGitHubStreak(username: string): Promise<StreakResult> {
  try {
    const commitsByRepoArray = await fetchCommitDates(username);

    // Flatten and convert all commit dates to Date objects
    const allCommitDates = commitsByRepoArray.flatMap((repo) =>
      repo.commitDates.map((date) => new Date(date)),
    );

    // Calculate streaks
    return longestStreakFn(allCommitDates);
  } catch (error) {
    console.error("Error calculating streak:", error);
    throw error;
  }
}
