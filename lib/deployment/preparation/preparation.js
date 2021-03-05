const shell = require('shelljs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');
const fs = require('fs');

const BRANCH_DIRECTORY_NAME = 'branch';

shell.set('-e');

module.exports = { prepareDeployDirectory };

function prepareDeployDirectory(
  deployDirectory,
  { directory: sourceDirectory, branch, defaultBranch, removeAfterDays },
) {
  createBranchDirectoryIfNeeded(deployDirectory, branch, defaultBranch);

  if (removeAfterDays) {
    cleanupOldDeploy(deployDirectory, { removeAfterDays, branch, defaultBranch });
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

async function cleanupOldDeploy(deployDirectory, { removeAfterDays, branch, defaultBranch }) {
  if (!removeAfterDays || branch === defaultBranch) {
    return;
  }
  try {
    const directories = glob.sync(getBranchDirectory(deployDirectory));
    console.log('directories', directories);
    console.log(
      'fs.readdirSync(getBranchDirectory(deployDirectory))',
      fs.readdirSync(getBranchDirectory(deployDirectory)),
    );
    console.log('fs.readdirSync(BRANCH_DIRECTORY_NAME)', fs.readdirSync(BRANCH_DIRECTORY_NAME));
    console.log(execSync('git ls-tree gh-pages --name-only branch/').toString());
    console.log(
      execSync('git ls-tree gh-pages --name-only branch/')
        .toString()
        .split('\n'),
    );

    console.log('===');

    console.log(execSync('git branch --no-merged master').toString());

    await Promise.all(
      directories.map(branchPath => {
        console.log(branchPath);
        const gitModified = execSync(`git log -1 --format="%ad" -- ${branchPath}`).toString();
        const differenceInTime = new Date().getTime() - new Date(gitModified).getTime();
        const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

        console.log(gitModified, differenceInTime, differenceInDays);
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
