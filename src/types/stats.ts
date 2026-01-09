export interface GitHubStats {
  user: GitHubUser
  commits: number
  reviews: number
  repositoriesContributedTo: number
  pullRequest: PullRequestStats
  issues: IssuesStats
  followers: number
  discussions: DiscussionsStats
  repositories: RepositoriesStats
  rank: RankStats
}

export interface GitHubUser {
  name: string
  username: string
  avatar: string
}

export interface PullRequestStats {
  totalCount: number
  mergedCount: number
  data: PullRequest[]
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

export interface IssuesStats {
  totalCount: number
  openCount: number
  closedCount: number
}

export interface DiscussionsStats {
  totalCount: number
  commentsCount: number
}

export interface RepositoriesStats {
  totalCount: number
  totalStargazers: number
  data: Repository[]
}

export interface Repository {
  name: string
  stargazers: number
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

export interface RankStats {
  level: string
  percentile: number
}
