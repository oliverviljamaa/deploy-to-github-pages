const shell = require('shelljs');
const path = require('path');
const { execSync } = require('child_process');

const BRANCH_DIRECTORY_NAME = 'branch';

shell.set('-e');

module.exports = { prepareDeployDirectory, getExpiredBranchFolders };

function prepareDeployDirectory(
  deployDirectory,
  { directory: sourceDirectory, branch, defaultBranch },
) {
  createBranchDirectoryIfNeeded(deployDirectory, branch, defaultBranch);

  copyContentWithReplacement(
    sourceDirectory,
    getTargetDirectory(deployDirectory, branch, defaultBranch),
  );
}

function createBranchDirectoryIfNeeded(deployDirectory, branch, defaultBranch) {
  if (branch !== defaultBranch) {
    shell.mkdir('-p', getBranchDirectory(deployDirectory));
  }
}

function getBranchDirectory(deployDirectory) {
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

function getExpiredBranchFolders({ clean }) {
  if (!clean) {
    return false;
  }

  const root = `/Users/andrea.piras/Projects/Neptune/neptune-web/${BRANCH_DIRECTORY_NAME}/`;
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

  return glob;
}
