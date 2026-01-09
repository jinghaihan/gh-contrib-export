import type {
  GitHubStats,
  GitHubUser,
  GraphQLResponse,
  GraphQLUser,
  Options,
  PullRequest,
} from './types'
import { execa } from 'execa'
import pRetry from 'p-retry'
import { GRAPHQL_STATS_QUERY } from './constants'
import { getOctoKit } from './utils'

const RepoCache = new Map()

export async function readTokenFromGitHubCli() {
  try {
    const { stdout } = await execa('gh', ['auth', 'token'])
    return stdout.trim()
  }
  catch {
    return ''
  }
}

export async function getRepo(owner: string, name: string, token: string) {
  if (RepoCache.has(`${owner}/${name}`))
    return RepoCache.get(`${owner}/${name}`)

  const octokit = getOctoKit(token)
  // Fetch repository details to get owner type
  const { data } = await octokit.request('GET /repos/{owner}/{name}', {
    owner,
    name,
  })

  RepoCache.set(`${owner}/${name}`, data)
  return data
}

export async function getUser(options: Options): Promise<GitHubUser> {
  const octokit = getOctoKit(options.token)
  const response = await pRetry(
    async () => {
      return await octokit.request('GET /user')
    },
    { retries: 3 },
  )
  return {
    name: response.data.name ?? response.data.login,
    username: response.data.login,
    avatar: response.data.avatar_url,
  }
}

export async function getPullRequests(username: string, options: Options): Promise<PullRequest[]> {
  const octokit = getOctoKit(options.token)
  const response = await pRetry(
    async () => {
      return await octokit.request('GET /search/issues', {
        // To exclude the pull requests to your repositories
        // q: `type:pr+author:"${user.username}"+-user:"${user.username}"`,
        // To include the pull requests to your repositories
        q: `type:pr+author:"${username}"`,
        per_page: options.perPage,
        page: 1,
        advanced_search: 'true',
      })
    },
    { retries: 3 },
  )

  // Filter out closed PRs that are not merged
  const filteredPrs = response.data.items.filter(pr => !(pr.state === 'closed' && !pr.pull_request?.merged_at))

  const prs: PullRequest[] = []
  // For each PR, fetch the repository details
  for (const pr of filteredPrs) {
    const [owner, name] = pr.repository_url.split('/').slice(-2)
    const repo = await getRepo(owner!, name!, options.token)

    prs.push({
      repo: `${owner}/${name}`,
      title: pr.title,
      url: pr.html_url,
      created_at: pr.created_at,
      state: pr.pull_request?.merged_at ? 'merged' : pr.draft ? 'draft' : pr.state as 'open' | 'closed',
      number: pr.number,
      type: repo.owner.type, // Add type information (User or Organization)
      stars: repo.stargazers_count,
    })
  }

  return prs
}

export async function getGraphQLStats(user: GitHubUser, options: Options): Promise<GraphQLUser> {
  const octokit = getOctoKit(options.token)

  const variables = {
    login: user.username,
    after: null,
    includeMergedPullRequests: true,
    includeDiscussions: true,
    includeDiscussionsAnswers: true,
  }

  const response = await pRetry(
    async () => {
      return await octokit.graphql(GRAPHQL_STATS_QUERY, variables)
    },
    { retries: 3 },
  )
  const { user: graphqlUser } = response as GraphQLResponse
  return graphqlUser
}

export async function updateGist(data: GitHubStats, gistId: string, token: string): Promise<string> {
  const octokit = getOctoKit(token)
  const existingGist = await pRetry(
    async () => {
      return await octokit.request('GET /gists/{gist_id}', {
        gist_id: gistId,
      })
    },
    { retries: 3 },
  )
  if (!existingGist.data.files?.[`github-stats.json`])
    throw new Error('Gist does not contain github-stats.json file')

  const content = JSON.stringify(data, null, 2)
  const response = await pRetry(
    async () => {
      return await octokit.request('PATCH /gists/{gist_id}', {
        gist_id: gistId,
        files: {
          'github-stats.json': {
            content,
          },
        },
      })
    },
    { retries: 3 },
  )

  return response.data.html_url!
}
