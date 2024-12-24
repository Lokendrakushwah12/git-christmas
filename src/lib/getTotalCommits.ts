export async function getTotalCommits(username: string) {
  console.log("Fetching total commits for:", username);
  let totalCommits = 0;

  try {
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`
    );
    const repos = await reposResponse.json();

    if (!Array.isArray(repos)) {
      throw new Error("Failed to fetch repositories or received invalid data.");
    }

    console.log("Fetched Repositories:", repos);

    for (const repo of repos) {
      console.log("Processing repository:", repo.name);

      let page = 1;
      while (true) {
        const commitsResponse = await fetch(
          `${repo.commits_url.replace("{/sha}", "")}?per_page=100&page=${page}`
        );
        const commits = await commitsResponse.json();

        console.log(`Fetched ${commits.length} commits for page ${page}`);

        if (!Array.isArray(commits) || commits.length === 0) break;

        totalCommits += commits.length;
        page++;
      }
    }

    console.log("Total commits:", totalCommits);
    return totalCommits;
  } catch (error) {
    console.error("Error fetching total commits:", error);
    return 0;
  }
}
