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
