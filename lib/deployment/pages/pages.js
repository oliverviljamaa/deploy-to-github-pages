const ghpages = require('gh-pages');
const { execSync } = require('child_process');

module.exports = { deployDirectoryToGithubPages };

async function deployDirectoryToGithubPages(directory, options) {
  try {
    await deploy(directory, options);
    await cleanup(options);
  } catch (err) {
    throw new Error(
      `Cannot deploy to GitHub pages:\n${err}${
        options.verbose ? `\nwith options:\n${JSON.stringify(options, undefined, 2)}` : ''
      }`,
    );
  }
}

function deploy(directory, { token, owner, repo, verbose, dotfiles }) {
  const params = {
    add: true,
    repo: `https://${token}@github.com/${owner}/${repo}.git`,
    silent: !verbose,
    dotfiles,
  };

  return new Promise((resolve, reject) => {
    ghpages.publish(directory, params, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

function cleanup({ clean, token, owner, repo, verbose, dotfiles, directory }) {
  if (!clean) {
    return false;
  }

  const root = '/Users/andrea.piras/Projects/Neptune/neptune-web/branch/';
  let glob = execSync(`git ls-tree -d gh-pages --name-only -- ${root}`).toString();

  glob = glob.split('\n').reduce((accumulator, branchPath) => {
    if (!branchPath) {
      return accumulator;
    }
    const gitModified = execSync(`git log gh-pages -1 --format="%ad" -- ${branchPath}`, {
      cwd: process.cwd(),
    }).toString();

    const differenceInTime = new Date().getTime() - new Date(gitModified).getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    if (differenceInDays < clean) {
      accumulator.push(branchPath.split('/').pop());
    }
    return accumulator;
  }, []);

  const params = {
    remove: `branch/+(${glob.join('|')}`,
    repo: `https://${token}@github.com/${owner}/${repo}.git`,
    silent: !verbose,
    dotfiles,
  };

  return new Promise((resolve, reject) => {
    ghpages.publish(directory, params, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}
