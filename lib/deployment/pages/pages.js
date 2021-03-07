const ghpages = require('gh-pages');

module.exports = { deployDirectoryToGithubPages };

async function deployDirectoryToGithubPages(directory, expiredFolders = null, options) {
  try {
    const params = getParams(options);
    await deploy(directory, params);
    if (expiredFolders) {
      await cleanup(directory, expiredFolders, params);
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

function cleanup(directory, expiredFolders, params) {
  return new Promise((resolve, reject) => {
    ghpages.publish(
      directory,
      { ...params, remove: `branch/+(${expiredFolders.join('|')}` },
      err => {
        if (err) {
          reject(err);
        }
        resolve();
      },
    );
  });
}

function getParams({ token, owner, repo, verbose, dotfiles }) {
  return {
    repo: `https://${token}@github.com/${owner}/${repo}.git`,
    silent: !verbose,
    dotfiles,
  };
}
