import type { CommandOptions, Options } from './types'
import process from 'node:process'
import { DEFAULT_OPTIONS } from './constants'
import { readTokenFromGitHubCli } from './git'

function normalizeConfig(options: Partial<CommandOptions>) {
  // interop
  if ('default' in options)
    options = options.default as Partial<CommandOptions>

  return options
}

export async function resolveConfig(options: Partial<CommandOptions>): Promise<Options> {
  const defaults = structuredClone(DEFAULT_OPTIONS)
  options = normalizeConfig(options)

  const merged = { ...defaults, ...options }

  merged.cwd = merged.cwd || process.cwd()
  merged.token = merged.token || process.env.GH_PAT || process.env.GITHUB_TOKEN || await readTokenFromGitHubCli()
  merged.gistId = merged.gistId || process.env.GIST_ID

  return merged as Options
}
