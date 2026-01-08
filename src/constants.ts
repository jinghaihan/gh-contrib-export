import type { CommandOptions } from './types'
import pkg from '../package.json'

export const NAME = pkg.name

export const VERSION = pkg.version

export const DEFAULT_OPTIONS: Partial<CommandOptions> = {
  apiVersion: '2022-11-28',
  perPage: 50,
  baseUrl: 'github.com',
  yes: false,
}

const GRAPHQL_REPOS_FIELD = `
  repositories(first: 100, ownerAffiliations: OWNER, orderBy: {direction: DESC, field: STARGAZERS}, after: $after) {
    totalCount
    nodes {
      name
      stargazers {
        totalCount
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
`

export const GRAPHQL_STATS_QUERY = `
query userInfo($login: String!, $after: String, $includeMergedPullRequests: Boolean!, $includeDiscussions: Boolean!, $includeDiscussionsAnswers: Boolean!, $startTime: DateTime = null) {
  user(login: $login) {
    name
    login
    commits: contributionsCollection (from: $startTime) {
      totalCommitContributions,
    }
    reviews: contributionsCollection {
      totalPullRequestReviewContributions
    }
    repositoriesContributedTo(first: 1, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, REPOSITORY]) {
      totalCount
    }
    pullRequests(first: 1) {
      totalCount
    }
    mergedPullRequests: pullRequests(states: MERGED) @include(if: $includeMergedPullRequests) {
      totalCount
    }
    openIssues: issues(states: OPEN) {
      totalCount
    }
    closedIssues: issues(states: CLOSED) {
      totalCount
    }
    followers {
      totalCount
    }
    repositoryDiscussions @include(if: $includeDiscussions) {
      totalCount
    }
    repositoryDiscussionComments(onlyAnswers: true) @include(if: $includeDiscussionsAnswers) {
      totalCount
    }
    ${GRAPHQL_REPOS_FIELD}
  }
}
`
