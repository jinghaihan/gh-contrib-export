import type { RankParams, RankStats } from './types'

/**
 * Calculates the exponential cdf.
 */
function exponential_cdf(x: number): number {
  return 1 - 2 ** -x
}

/**
 * Calculates the log normal cdf.
 */
function log_normal_cdf(x: number): number {
  // approximation
  return x / (1 + x)
}

/**
 * Calculates the users rank based on their GitHub statistics.
 */
export function calculateRank({
  commits,
  prs,
  issues,
  reviews,
  repos: _repos, // unused
  stars,
  followers,
}: RankParams): RankStats {
  const COMMITS_MEDIAN = 250
  const COMMITS_WEIGHT = 2
  const PRS_MEDIAN = 50
  const PRS_WEIGHT = 3
  const ISSUES_MEDIAN = 25
  const ISSUES_WEIGHT = 1
  const REVIEWS_MEDIAN = 2
  const REVIEWS_WEIGHT = 1
  const STARS_MEDIAN = 50
  const STARS_WEIGHT = 4
  const FOLLOWERS_MEDIAN = 10
  const FOLLOWERS_WEIGHT = 1

  const TOTAL_WEIGHT
    = COMMITS_WEIGHT
      + PRS_WEIGHT
      + ISSUES_WEIGHT
      + REVIEWS_WEIGHT
      + STARS_WEIGHT
      + FOLLOWERS_WEIGHT

  const THRESHOLDS = [1, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100]
  const LEVELS = ['S', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C']

  const rank
    = 1
      - (COMMITS_WEIGHT * exponential_cdf(commits / COMMITS_MEDIAN)
        + PRS_WEIGHT * exponential_cdf(prs / PRS_MEDIAN)
        + ISSUES_WEIGHT * exponential_cdf(issues / ISSUES_MEDIAN)
        + REVIEWS_WEIGHT * exponential_cdf(reviews / REVIEWS_MEDIAN)
        + STARS_WEIGHT * log_normal_cdf(stars / STARS_MEDIAN)
        + FOLLOWERS_WEIGHT * log_normal_cdf(followers / FOLLOWERS_MEDIAN))
      / TOTAL_WEIGHT

  const level = LEVELS[THRESHOLDS.findIndex(t => rank * 100 <= t)]

  return { level, percentile: rank * 100 }
}
