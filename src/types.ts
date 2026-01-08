export interface CommandOptions {
  cwd?: string
  /**
   * GitHub token
   * https://github.com/settings/personal-access-tokens
   */
  token?: string
  /**
   * GitHub API version
   */
  apiVersion?: string
  /**
   * GitHub API per page count
   */
  perPage?: number
  /**
   * Github base url
   * @default github.com
   */
  baseUrl?: string
  /**
   * GitHub Gist ID
   */
  gistId?: string
  /**
   * Whether to skip the confirmation prompt
   */
  yes?: boolean
}

export interface Options extends Required<CommandOptions> {}

export interface User {
  name: string
  username: string
  avatar: string
}

export interface PullRequest {
  repo: string
  title: string
  url: string
  created_at: string
  state: 'open' | 'closed' | 'merged' | 'draft'
  number: number
  type: 'User' | 'Organization'
  stars: number
}

export interface GitHubStats {
  user: User
  contributions: PullRequest[]
  commits: ContributionsCollection
  reviews: ContributionsCollection
  repositoriesContributedTo: RepositoriesContributedTo
  pullRequests: PullRequestsData
  mergedPullRequests: PullRequestsData
  openIssues: IssuesData
  closedIssues: IssuesData
  followers: FollowersData
  repositoryDiscussions: RepositoryDiscussionsData
  repositoryDiscussionComments: RepositoryDiscussionCommentsData
  repositories: RepositoriesData
  rank: RankResult
}

export interface GraphQLStatsResponse {
  user: GraphQLUser
}

export interface GraphQLUser {
  name: string
  login: string
  commits: ContributionsCollection
  reviews: ContributionsCollection
  repositoriesContributedTo: RepositoriesContributedTo
  pullRequests: PullRequestsData
  mergedPullRequests: PullRequestsData
  openIssues: IssuesData
  closedIssues: IssuesData
  followers: FollowersData
  repositoryDiscussions: RepositoryDiscussionsData
  repositoryDiscussionComments: RepositoryDiscussionCommentsData
  repositories: RepositoriesData
}

export interface ContributionsCollection {
  totalCommitContributions?: number
  totalPullRequestReviewContributions?: number
}

export interface RepositoriesContributedTo {
  totalCount: number
}

export interface PullRequestsData {
  totalCount: number
}

export interface IssuesData {
  totalCount: number
}

export interface FollowersData {
  totalCount: number
}

export interface RepositoryDiscussionsData {
  totalCount: number
}

export interface RepositoryDiscussionCommentsData {
  totalCount: number
}

export interface RepositoriesData {
  totalCount: number
  nodes: Repository[]
}

export interface Repository {
  name: string
  stargazers: StargazersData
}

export interface StargazersData {
  totalCount: number
}

export interface RankParams {
  commits: number
  prs: number
  issues: number
  reviews: number
  repos: number
  stars: number
  followers: number
}

export interface RankResult {
  level: string
  percentile: number
}
