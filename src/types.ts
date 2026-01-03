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
