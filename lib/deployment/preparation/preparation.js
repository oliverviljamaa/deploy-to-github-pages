const shell = require('shelljs');
const path = require('path');

const BRANCH_DIRECTORY_NAME = 'branch';

shell.set('-e');

module.exports = { prepareDeployDirectory };

function prepareDeployDirectory(deployDirectory, { directory: sourceDirectory, branch }) {
  createBranchDirectoryIfNeeded(deployDirectory, branch);

  copyContentWithReplacement(sourceDirectory, getTargetDirectory(deployDirectory, branch));
}

function createBranchDirectoryIfNeeded(deployDirectory, branch) {
  if (!isMaster(branch)) {
    shell.mkdir('-p', getBranchDirectory(deployDirectory));
  }
}

function isMaster(branch) {
  return branch === 'master';
}

function getBranchDirectory(deployDirectory) {
  return path.join(deployDirectory, BRANCH_DIRECTORY_NAME);
}

function getTargetDirectory(deployDirectory, branch) {
  return isMaster(branch)
    ? deployDirectory
    : path.join(getBranchDirectory(deployDirectory), branch);
}

function copyContentWithReplacement(source, target) {
  shell.rm('-rf', target);
  shell.cp('-r', source, target);
}
