# GitHub Contributions Export

[![npm version][npm-version-src]][npm-version-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

A CLI tool to export your GitHub contributions (Pull Requests) and publish to a GitHub Gist. Automatically sync your contribution data to a Gist for easy sharing and tracking.

<p align='center'>
<img src='./assets/help.png' />
</p>

## Usage

### Local usage

Run the tool locally to export your contributions:

```bash
export GH_PAT=your_github_token

# Export to local file
npx gh-contrib-export

# Export and update Gist
npx gh-contrib-export --gist-id id
```

### GitHub CI usage

> [!IMPORTANT]
> Your Gist must already exist and contain a file named `contributions.json`. The tool will update this file with your latest contributions. If the file doesn't exist, the tool will throw an error.

**Set up GitHub Actions** to automatically sync your contributions on a schedule:

```yaml
name: Upload Contributions

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set node
        uses: actions/setup-node@v4
        with:
          node-version: lts/*

      - name: Export and Update Gist
        run: npx gh-contrib-export
        env:
          GH_PAT: ${{ secrets.GH_PAT }}
          GIST_ID: ${{ secrets.GIST_ID }}
```

**Configure secrets in your repository**:
   - Go to your repository Settings > Secrets and variables > Actions
   - Add `GH_PAT` as a repository secret (your GitHub Personal Access Token)
   - Add `GIST_ID` as a repository secret (the ID of your Gist containing `contributions.json`)

## Credits

This project is inspired by:
- [releases.antfu.me](https://github.com/antfu/releases.antfu.me) - @[Anthony Fu](https://github.com/antfu)
- [my-pull-requests](https://github.com/atinux/my-pull-requests) - @[Sébastien Chopin](https://github.com/atinux)

## License

[MIT](./LICENSE) License © [jinghaihan](https://github.com/jinghaihan)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/gh-contrib-export?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/gh-contrib-export
[npm-downloads-src]: https://img.shields.io/npm/dm/gh-contrib-export?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/gh-contrib-export
[bundle-src]: https://img.shields.io/bundlephobia/minzip/gh-contrib-export?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=gh-contrib-export
[license-src]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/jinghaihan/gh-contrib-export/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/gh-contrib-export
