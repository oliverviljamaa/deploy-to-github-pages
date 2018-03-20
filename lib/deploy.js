const { createOptions } = require('./options');
const {
  createPendingDeploymentStatus,
  updateDeploymentStatusToSuccessForId,
  updateDeploymentStatusToFailureForId,
} = require('./statuses');
const { deployToGithubPages } = require('./deployment');

module.exports = deploy;

async function deploy(passedOptions = {}) {
  const options = createOptions(passedOptions);

  let id;
  try {
    id = await createPendingDeploymentStatus(options);
  } catch (err) {
    throw new Error(err);
  }

  try {
    await deployToGithubPages(options);
  } catch (err) {
    await updateDeploymentStatusToFailureForId(id, options);

    throw new Error(err);
  }

  return updateDeploymentStatusToSuccessForId(id, options);
}
