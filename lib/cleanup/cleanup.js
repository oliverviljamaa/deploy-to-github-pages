const { execSync } = require('child_process');
const shell = require('shelljs');
const glob = require('glob');
const path = require('path');

module.exports = cleanup;

const execSyncWithMessage = ({ command, message }) => {
  execSync(command, (err, output, stderr) => {
    if (err) {
      console.log(`error: ${err.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
  });
  console.log(message);
};

async function cleanup({ clean, branch, BRANCH_DIRECTORY_NAME }) {
  const root = path.join(process.cwd(), `../../${BRANCH_DIRECTORY_NAME}/*`);

  try {
    if (branch !== 'gh-pages') {
      execSyncWithMessage({
        command: `git checkout gh-pages`,
        message: `cleanup: checkout to gh-pages`,
      });
    }

    const paths = glob.sync(root);

    await Promise.all(
      paths.map(branchPath => {
        const gitModified = execSync(`git log -1 --format="%ad" -- ${branchPath}`).toString();
        const differenceInTime = new Date().getTime() - new Date(gitModified).getTime();
        const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

        if (differenceInDays >= clean) {
          console.log('removed folder', branchPath);
          shell.rm('-rf', branchPath);
        }
        return true;
      }),
    );

    execSyncWithMessage({
      command: `git commit -am "chore: deploy-to-github-pages cleanup"`,
      message: `cleanup: commit`,
    });

    execSyncWithMessage({
      command: `git checkout ${branch}`,
      message: `cleanup: checkout to ${branch}`,
    });
  } catch (err) {
    console.log(err);
  }
}
