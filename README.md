# :rocket: deploy-directory-on-branch-to-gh-pages

[![npm](https://img.shields.io/npm/v/deploy-directory-on-branch-to-gh-pages.svg)](https://www.npmjs.com/package/deploy-directory-on-branch-to-gh-pages)
[![GitHub release](https://img.shields.io/github/release/oliverviljamaa/deploy-directory-on-branch-to-gh-pages.svg)](https://github.com/oliverviljamaa/deploy-directory-on-branch-to-gh-pages/releases)
[![CircleCI](https://img.shields.io/circleci/project/github/oliverviljamaa/deploy-directory-on-branch-to-gh-pages/master.svg)](https://circleci.com/gh/oliverviljamaa/deploy-directory-on-branch-to-gh-pages)
[![npm](https://img.shields.io/npm/l/deploy-directory-on-branch-to-gh-pages.svg)](https://github.com/oliverviljamaa/deploy-directory-on-branch-to-gh-pages/blob/master/LICENSE)

A Node and CLI tool that makes deploying a directory on a branch to GitHub pages easy and automatic,
to help your peers QA your built docs/demos easily for better feedback.

It also sends a status to a Pull request, if one exists:

<img src="https://user-images.githubusercontent.com/5443561/37659087-e9f1cc14-2c46-11e8-82cf-1e76750d0e3f.gif" width="480">

## Installation

```bash
npm install -D deploy-directory-on-branch-to-gh-pages
```

## Usage

### CLI

```bash
deploy-directory-on-branch-to-gh-pages [...options]
```

### Node

```javascript
const deploy = require('deploy-directory-on-branch-to-gh-pages');

deploy(options).catch(err => { console.log(err); })
```

### Options

| Option      | flag  | description                                        | default    | env variable   | required | required with CircleCI |
|-------------|------:|----------------------------------------------------|------------|----------------|---------:|-----------------------:|
| `directory` |    -d | directory you wish to deploy                       | `'public'` |                |        * |                      * |
| `token`     |    -t | [GitHub token](https://github.com/settings/tokens) |            | `GITHUB_TOKEN` |        * |                      * |
| `owner`     |    -o | GitHub repo owner/org                              |            |                |        * |                        |
| `repo`      |    -r | GitHub repo name                                   |            |                |        * |                        |
| `branch`    |    -b | branch name                                        |            |                |        * |                        |
| `buildUrl`  |    -u | link displayed when deployment fails               |            |                |          |                        |

Therefore, if ran from CircleCI with a `GITHUB_TOKEN` environment variable present and the directory to be deployed is named `public`, _no configuration options are needed_, so just the following is enough:

```bash
deploy-directory-on-branch-to-gh-pages
```

or

```javascript
deploy().catch(err => { console.log(err); })
```

## Contributing

1. Run tests with `npm run jest` or `npm run jest:watch`. `npm test` will check for package and changelog version match, ESLint and Prettier format in addition.
1. Develop.
1. **Bump version number in `package.json` according to [semver](http://semver.org/) and add an item that a release will be based on to `CHANGELOG.md`**.
1. Submit your pull request from a feature branch and get code reviewed.
1. If the pull request is approved and the [CircleCI build](https://circleci.com/gh/oliverviljamaa/deploy-directory-on-branch-to-gh-pages) passes, you will be able to squash and merge.
1. Code will automatically be released to [GitHub](https://github.com/oliverviljamaa/deploy-directory-on-branch-to-gh-pages/releases) and published to [npm](https://www.npmjs.com/package/deploy-directory-on-branch-to-gh-pages) according to the version specified in the changelog and `package.json`.

## Other

For features and bugs, feel free to [add issues](https://github.com/oliverviljamaa/deploy-directory-on-branch-to-gh-pages/issues) or contribute.