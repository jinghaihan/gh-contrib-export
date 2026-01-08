import type { CAC } from 'cac'
import type {
  CommandOptions,
  GitHubStats,
  GraphQLUser,
  Options,
  PullRequest,
  User,
} from './types'
import { writeFile } from 'node:fs/promises'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { cac } from 'cac'
import { join } from 'pathe'
import { resolveConfig } from './config'
import { NAME, VERSION } from './constants'
import { getGraphQLStats, getPullRequests, getUser, updateGist } from './git'
import { calculateRank } from './rank'

try {
  const cli: CAC = cac(NAME)

  cli
    .command('', 'Export GitHub stats and publish to a GitHub Gist')
    .option('--cwd <path>', 'Working directory')
    .option('--token <token>', 'GitHub token')
    .option('--api-version <version>', 'GitHub API version', { default: '2022-11-28' })
    .option('--per-page <count>', 'GitHub API per page count', { default: 50 })
    .option('--base-url <url>', 'GitHub base URL', { default: 'github.com' })
    .option('--gist-id <id>', 'GitHub Gist ID')
    .allowUnknownOptions()
    .action(async (options: Partial<CommandOptions>) => {
      p.intro(`${c.yellow`${NAME} `}${c.dim`v${VERSION}`}`)

      const config = await resolveConfig(options)

      const user = await fetchUser(config)
      const contributions = await fetchContributions(user, config)

      const stats = await fetchStats(user, config)
      const data: Omit<GitHubStats, 'rank'> = {
        user,
        contributions,
        commits: stats.commits,
        reviews: stats.reviews,
        repositoriesContributedTo: stats.repositoriesContributedTo,
        pullRequests: stats.pullRequests,
        mergedPullRequests: stats.mergedPullRequests,
        openIssues: stats.openIssues,
        closedIssues: stats.closedIssues,
        followers: stats.followers,
        repositoryDiscussions: stats.repositoryDiscussions,
        repositoryDiscussionComments: stats.repositoryDiscussionComments,
        repositories: stats.repositories,
      }

      const rank = calculateRank({
        commits: data.commits.totalCommitContributions ?? 0,
        prs: data.pullRequests.totalCount ?? 0,
        issues: data.openIssues.totalCount + data.closedIssues.totalCount,
        reviews: data.reviews.totalPullRequestReviewContributions ?? 0,
        repos: data.repositories.totalCount,
        stars: data.repositories.nodes.reduce((acc, repo) => acc + repo.stargazers.totalCount, 0),
        followers: data.followers.totalCount ?? 0,
      })

      await generate({ ...data, rank }, config)
    })

  cli.help()
  cli.version(VERSION)
  cli.parse()
}
catch (error) {
  console.error(error)
  process.exit(1)
}

async function fetchUser(options: Options): Promise<User> {
  const spinner = p.spinner()
  spinner.start('getting user information')
  const user = await getUser(options)
  spinner.stop('user information retrieved')
  return user
}

async function fetchStats(user: User, options: Options): Promise<GraphQLUser> {
  const spinner = p.spinner()
  spinner.start('getting stats')
  const stats = await getGraphQLStats(user, options)
  spinner.stop('stats retrieved')
  return stats
}

async function fetchContributions(user: User, options: Options): Promise<PullRequest[]> {
  const spinner = p.spinner()
  spinner.start('getting pull requests')
  const data = await getPullRequests(user.username, options)
  spinner.stop(`pull requests retrieved: ${data.length}`)
  return data
}

async function generate(data: GitHubStats, options: Options) {
  const filepath = join(options.cwd, 'github-stats.json')
  await writeFile(filepath, JSON.stringify(data, null, 2))

  if (!options.gistId) {
    p.outro(`${c.green('✓')} ${c.dim('Local file:')} ${filepath}`)
    return
  }

  const spinner = p.spinner()
  try {
    spinner.start('updating gist')
    const gistUrl = await updateGist(data, options.gistId, options.token)
    spinner.stop('gist updated successfully')
    p.outro(`${c.green('✓')} ${c.dim('Gist URL:')} ${gistUrl}`)
  }
  catch (error) {
    spinner.stop('failed to update gist')
    p.outro(`${c.red('✗')} ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
