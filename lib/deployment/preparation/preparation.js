const shell = require('shelljs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');

const BRANCH_DIRECTORY_NAME = 'branch';

shell.set('-e');

module.exports = { prepareDeployDirectory };

function prepareDeployDirectory(
  deployDirectory,
  { directory: sourceDirectory, branch, defaultBranch, removeAfterDays },
) {
  createBranchDirectoryIfNeeded(deployDirectory, branch, defaultBranch);

  if (removeAfterDays) {
    cleanupOldDeploy({ removeAfterDays, branch, defaultBranch });
  }

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

async function cleanupOldDeploy({ removeAfterDays, branch, defaultBranch }) {
  if (!removeAfterDays || branch === defaultBranch) {
    return;
  }
  try {
    await Promise.all(
      glob.sync(BRANCH_DIRECTORY_NAME).map(branchPath => {
        console.log(branchPath);
        const gitModified = execSync(`git log -1 --format="%ad" -- ${branchPath}`).toString();
        const differenceInTime = new Date().getTime() - new Date(gitModified).getTime();
        const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

        if (differenceInDays >= removeAfterDays) {
          console.log(differenceInDays, removeAfterDays);
          console.log(differenceInDays >= removeAfterDays);
          shell.rm('-rf', branchPath);
        }
        return true;
      }),
    );
  } catch (err) {
    console.log(err);
  }
}
