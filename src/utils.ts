import { Octokit } from '@octokit/core'

let octoKit: Octokit
export function getOctoKit(token: string) {
  if (!octoKit) {
    octoKit = new Octokit({
      auth: `Bearer ${token}`,
    })
  }
  return octoKit
}
