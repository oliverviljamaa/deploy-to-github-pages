const { prepareDeployDirectory, getExpiredBranchFolders } = require('./preparation');
const { deployDirectoryToGithubPages } = require('./pages');

const DEPLOY_DIRECTORY = 'deploy-directory';

function deployToGithubPages(options) {
  prepareDeployDirectory(DEPLOY_DIRECTORY, options);
  const expiredBranchFolders = getExpiredBranchFolders(options);

  return deployDirectoryToGithubPages(DEPLOY_DIRECTORY, expiredBranchFolders, options);
}

module.exports = { deployToGithubPages };
