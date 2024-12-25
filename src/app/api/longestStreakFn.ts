export const longestStreakFn = async (repoData: any) => {
  const commitDates: string[] = [];
  const now = new Date();
  const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  const headers: HeadersInit = {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
    Accept: "application/json",
  };

  const getCommitsQuery = (repos: any[], cursor: string | null = null) => {
    let repoQueryPart = "";
    repos.forEach((repo, index) => {
      repoQueryPart += `
        repo${index}: repository(owner: "${repo.owner.login}", name: "${repo.name}") {
          defaultBranchRef {
            name
            target {
              ... on Commit {
                history(first: 100, since: "${yearAgo.toISOString()}", after: ${cursor ? `"${cursor}"` : "null"}) {
                  pageInfo {
                    hasNextPage
                    endCursor
                  }
                  nodes {
                    committedDate
                  }
                }
              }
            }
          }
        }
      `;
    });
    return `
      query {
        ${repoQueryPart}
      }
    `;
  };

  const fetchCommitsForRepos = async (repos: any[]) => {
    let allCommitDates: string[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;

    while (hasNextPage) {
      const query = getCommitsQuery(repos, cursor);
      const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      if (data.errors) {
        console.error("Failed to fetch commits:", data.errors);
        break;
      }

      hasNextPage = false;
      repos.forEach((repo, index) => {
        const repoData = data.data[`repo${index}`];
        if (repoData?.defaultBranchRef?.target?.history) {
          const history = repoData.defaultBranchRef.target.history;

          if (history.pageInfo.hasNextPage) {
            hasNextPage = true;
            cursor = history.pageInfo.endCursor;
          }

          const dates = history.nodes
            .map((node: any) => node.committedDate)
            .filter(
              (date: string | undefined): date is string => date !== undefined,
            );
          allCommitDates.push(...dates);
        }
      });
    }

    return allCommitDates;
  };

  const publicRepos = repoData.filter((repo: any) => !repo.private);
  const commitDatesForRepos = await fetchCommitsForRepos(publicRepos);
  commitDates.push(...commitDatesForRepos);

  const commitsByDate = new Map<string, boolean>();
  commitDates.forEach((date) => {
    if (date) {
      const dateStr: any = new Date(date).toISOString().split("T")[0];
      commitsByDate.set(dateStr, true);
    }
  });

  const sortedDates = Array.from(commitsByDate.keys()).sort();

  const streaks: number[] = [];
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i] || "");
    const previousDate = new Date(sortedDates[i - 1] || "");

    const diffInTime = currentDate.getTime() - previousDate.getTime();
    const diffInDays = Math.round(diffInTime / (1000 * 3600 * 24));

    if (diffInDays === 1) {
      currentStreak++;
    } else {
      streaks.push(currentStreak);
      currentStreak = 1;
    }
  }

  if (currentStreak > 0) {
    streaks.push(currentStreak);
  }

  const longestStreak = streaks.length > 0 ? Math.max(...streaks) : 0;
  return longestStreak;
};
