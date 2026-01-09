export interface GraphQLResponse {
  user: GraphQLUser
}

export interface GraphQLUser {
  name: string
  login: string
  commits: GraphQLContributions
  reviews: GraphQLContributions
  repositoriesContributedTo: GraphQLCountData
  pullRequests: GraphQLCountData
  mergedPullRequests: GraphQLCountData
  openIssues: GraphQLCountData
  closedIssues: GraphQLCountData
  followers: GraphQLCountData
  repositoryDiscussions: GraphQLCountData
  repositoryDiscussionComments: GraphQLCountData
  repositories: GraphQLRepositories
}

export interface GraphQLContributions {
  totalCommitContributions?: number
  totalPullRequestReviewContributions?: number
}

export interface GraphQLCountData {
  totalCount: number
}

export interface GraphQLRepositories {
  totalCount: number
  nodes: GraphQLRepository[]
}

export interface GraphQLRepository {
  name: string
  stargazers: GraphQLStargazersData
}

export interface GraphQLStargazersData {
  totalCount: number
}
