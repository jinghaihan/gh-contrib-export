import type { CAC } from 'cac'
import type { CommandOptions } from './types'
import { writeFile } from 'node:fs/promises'
import process from 'node:process'
import * as p from '@clack/prompts'
import c from 'ansis'
import { cac } from 'cac'
import { join } from 'pathe'
import { resolveConfig } from './config'
import { NAME, VERSION } from './constants'
import { getPullRequests, getUser, updateGist } from './git'

try {
  const cli: CAC = cac(NAME)

  cli
    .command('', 'export GitHub contributions and publish to a GitHub Gist')
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

      const userSpinner = p.spinner()
      userSpinner.start('getting user information')
      const user = await getUser(config)
      userSpinner.stop('user information retrieved')

      const prSpinner = p.spinner()
      prSpinner.start('getting pull requests')
      const prs = await getPullRequests(user.username, config)
      prSpinner.stop(`pull requests retrieved: ${prs.length}`)

      const data = { user, prs }
      const filepath = join(config.cwd, 'contributions.json')
      await writeFile(filepath, JSON.stringify(data, null, 2))

      if (config.gistId) {
        const gistSpinner = p.spinner()
        gistSpinner.start('updating gist')

        try {
          const gistUrl = await updateGist(data, config.gistId, config.token)
          gistSpinner.stop('gist updated successfully')
          p.outro(`${c.green('✓')} ${c.dim('Gist URL:')} ${gistUrl}`)
        }
        catch (error) {
          gistSpinner.stop('failed to update gist')
          p.outro(`${c.red('✗')} ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
      else {
        p.outro(`${c.green('✓')} ${c.dim('Local file:')} ${filepath}`)
      }
    })

  cli.help()
  cli.version(VERSION)
  cli.parse()
}
catch (error) {
  console.error(error)
  process.exit(1)
}
