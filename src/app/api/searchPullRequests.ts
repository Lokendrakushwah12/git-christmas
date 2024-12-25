export const searchPullRequests = async (username: string) => {
    const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN as string;
  
    if (!GITHUB_TOKEN) {
      throw new Error("GitHub token is not provided.");
    }
  
    const headers: HeadersInit = {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    };
  
    let totalMergedPRs = 0;
    const perPage = 100; // Max results per page
    let page = 1;
    let hasNextPage = true;
  
    // Loop to paginate through results
    while (hasNextPage) {
      // Query for closed PRs (without merged:yes)
      const pullsResponse = await fetch(
        `https://api.github.com/search/issues?q=is:pr+is:closed+user:${username}&page=${page}&per_page=${perPage}`,
        { headers }
      );
  
      if (!pullsResponse.ok) {
        const errorData = await pullsResponse.json();
        console.error("Error fetching pull requests:", errorData);
        break; // Exit the loop on error
      }
  
      const pullsData = await pullsResponse.json();
  
      // Filter for merged PRs (check merged_at field)
      const mergedPRs = pullsData.items.filter((pr: any) => pr.merged_at !== null);
  
      // Count merged PRs
      totalMergedPRs += mergedPRs.length;
      // Check if there are more pages
      hasNextPage = pullsData.items.length === perPage;
      page++;
    }
  
    return totalMergedPRs;
  };
  