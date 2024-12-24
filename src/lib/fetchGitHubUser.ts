const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export const fetchGitHubUser = async (username: string) => {
  if (!GITHUB_TOKEN) {
    return { userData: null, error: "GitHub token is not provided." };
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    });

    if (!response.ok) {
      return { userData: null, error: "Failed to fetch GitHub user data." };
    }

    const userData = await response.json();
    return { userData, error: null };
  } catch (error) {
    return { 
      userData: null, 
      error: (error as Error).message || "An unexpected error occurred." 
    };
  }
};