const shell = require('shelljs');
const path = require('path');

const DEPLOY_BRANCH_DIRECTORY = 'branch';

shell.set('-e');

module.exports = { prepareDeployDirectory };

function prepareDeployDirectory(directory, options) {
  checkoutPagesBranchToDeployDirectory(directory);
  moveDirectoryContentToDeployDirectory(directory, options);
}

function checkoutPagesBranchToDeployDirectory(directory) {
  createDeployDirectoryIfDoesNotExist(directory);

  try {
    pullGithubPagesBranchToDirectory(directory);
  } catch (err) {
    console.error(err);
    console.log('gh-pages branch does not exist yet, it will be created automatically...');
  }
}

function createDeployDirectoryIfDoesNotExist(directory) {
  shell.mkdir('-p', directory);
}

function pullGithubPagesBranchToDirectory(directory) {
  shell.exec(`git --work-tree=./${directory} checkout gh-pages -- .`, { silent: true });
}

function moveDirectoryContentToDeployDirectory(directory, options) {
  createBranchDirectoryIfDoesNotExist(directory);

  const source = options.directory;
  const target = path.join(directory, DEPLOY_BRANCH_DIRECTORY, options.branch);

  moveContent(source, target);
}

function createBranchDirectoryIfDoesNotExist(directory) {
  shell.mkdir('-p', path.join(directory, DEPLOY_BRANCH_DIRECTORY));
}

function moveContent(source, target) {
  shell.rm('-rf', target);
  shell.cp('-r', source, target);
}
