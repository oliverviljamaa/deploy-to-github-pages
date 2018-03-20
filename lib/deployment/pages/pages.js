const ghpages = require('gh-pages');

module.exports = { deployDirectoryToGithubPages };

async function deployDirectoryToGithubPages(directory, options) {
  try {
    await deploy(directory, options);
  } catch (err) {
    throw new Error(`Cannot deploy to GitHub pages:\n${err}`);
  }
}

function deploy(directory, { token, owner, repo }) {
  const params = {
    add: true,
    repo: `https://${token}@github.com/${owner}/${repo}.git`,
    silent: true,
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
