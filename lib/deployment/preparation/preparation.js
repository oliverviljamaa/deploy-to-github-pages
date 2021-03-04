const shell = require('shelljs');
const path = require('path');

shell.set('-e');

module.exports = { prepareDeployDirectory };

function prepareDeployDirectory(
  deployDirectory,
  { directory: sourceDirectory, branch, defaultBranch, BRANCH_DIRECTORY_NAME },
) {
  createBranchDirectoryIfNeeded(deployDirectory, branch, defaultBranch, BRANCH_DIRECTORY_NAME);

  copyContentWithReplacement(
    sourceDirectory,
    getTargetDirectory(deployDirectory, branch, defaultBranch),
  );
}

function createBranchDirectoryIfNeeded(
  deployDirectory,
  branch,
  defaultBranch,
  BRANCH_DIRECTORY_NAME,
) {
  if (branch !== defaultBranch) {
    shell.mkdir('-p', getBranchDirectory(deployDirectory, BRANCH_DIRECTORY_NAME));
  }
}

function getBranchDirectory(deployDirectory, BRANCH_DIRECTORY_NAME) {
  return path.join(deployDirectory, BRANCH_DIRECTORY_NAME);
}

function getTargetDirectory(deployDirectory, branch, defaultBranch) {
  return branch === defaultBranch
    ? deployDirectory
    : path.join(getBranchDirectory(deployDirectory), branch);
}

function copyContentWithReplacement(source, target) {
  shell.rm('-rf', target);
  shell.cp('-r', source, target);
}
