const ghpages = require('gh-pages');

module.exports = { deployDirectoryToGithubPages };

async function deployDirectoryToGithubPages(directory, expiredBranchFolders = null, options) {
  try {
    const params = getParams(options);
    await deploy(directory, params);
    if (expiredBranchFolders) {
      await cleanup(expiredBranchFolders, params);
    }
  } catch (err) {
    throw new Error(
      `Cannot deploy to GitHub pages:\n${err}${
        options.verbose ? `\nwith options:\n${JSON.stringify(options, undefined, 2)}` : ''
      }`,
    );
  }
}

function deploy(directory, params) {
  return new Promise((resolve, reject) => {
    ghpages.publish(directory, { ...params, add: true }, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

function cleanup(expiredBranchFolders, params) {
  return new Promise((resolve, reject) => {
    ghpages.publish({ ...params, remove: `branch/+(${expiredBranchFolders.join('|')}` }, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

function getParams({ token, owner, repo, verbose, dotfiles }) {
  return {
    repo: `https://${token}@github.com/${owner}/${repo}.git`,
    silent: !verbose,
    dotfiles,
  };
}
