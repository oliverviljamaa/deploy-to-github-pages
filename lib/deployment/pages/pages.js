const ghpages = require('gh-pages');

module.exports = { deployDirectoryToGithubPages };

async function deployDirectoryToGithubPages(directory) {
  try {
    await deploy(directory);
  } catch (err) {
    throw new Error(`Cannot deploy to GitHub pages:\n${err}`);
  }
}

function deploy(directory) {
  return new Promise((resolve, reject) => {
    ghpages.publish(directory, { add: true }, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}
