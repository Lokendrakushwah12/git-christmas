import { GraphQLClient } from 'graphql-request';

interface Commit {
  committedDate: string | null;
}

interface Repository {
  name: string;
  commits: {
    history: {
      nodes: Commit[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    } | null;
  };
}

interface GraphQLResponse {
  user: {
    repositories: {
      nodes: Repository[];
    };
  };
}

export const fetchCommitDates = async (username: string) => {
  const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN as string;

  if (!GITHUB_TOKEN) {
    throw new Error("GitHub token is not provided");
  }

  const client = new GraphQLClient('https://api.github.com/graphql', {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
  });

  const query = `
    query($username: String!, $cursor: String) {
      user(login: $username) {
        repositories(first: 10) {
          nodes {
            name
            commits: object(expression: "main") {
              ... on Commit {
                history(first: 100, after: $cursor) {
                  nodes {
                    committedDate
                  }
                  pageInfo {
                    hasNextPage
                    endCursor
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  let allCommitDates: string[] = [];
  let cursor: string | null = null;

  do {
    const variables = {
      username,
      cursor,
    };

    const data = await client.request<GraphQLResponse>(query, variables);

    if (!data?.user?.repositories?.nodes) {
      throw new Error("Failed to fetch repositories or commits");
    }

    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);

    const todayISO = today.toISOString().split('T')[0];
    const lastYearISO = lastYear.toISOString().split('T')[0];

    console.log('Fetched data:', data);
    data.user.repositories.nodes.forEach((repo) => {
      console.log(`Processing repository: ${repo.name}`);

      if (repo.commits?.history?.nodes?.length) {
        const commitDates = repo.commits.history.nodes
          .map((commit) => {
            const commitDate = commit.committedDate;
            if (commitDate) {
              const date = new Date(commitDate);
              return date.toISOString().split('T')[0];
            }
            return null;
          })
          .filter((date): date is string => date !== null)
          .filter((date) => date >= lastYearISO && date <= todayISO) || [];

        allCommitDates = [...allCommitDates, ...commitDates];
      } else {
        console.log(`No commits found for repository: ${repo.name}`);
      }
    });

    cursor = data.user.repositories.nodes[0]?.commits?.history.pageInfo?.hasNextPage
      ? data.user.repositories.nodes[0].commits.history.pageInfo.endCursor
      : null;

  } while (cursor);

  return allCommitDates;
};
