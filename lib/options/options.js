module.exports = { createOptions };

function createOptions(passedOptions) {
  const options = extendPassedOptions(passedOptions);

  validateOptions(options);

  return options;
}

function extendPassedOptions(options) {
  return extendWithCircleVariablesIfCircle(
    extendWithGithubTokenVariable(extendWithDefaultOptions(options)),
  );
}

function extendWithDefaultOptions(options) {
  return { directory: 'public', ...options };
}

function extendWithGithubTokenVariable(options) {
  return process.env.GITHUB_TOKEN ? { token: process.env.GITHUB_TOKEN, ...options } : options;
}

function extendWithCircleVariablesIfCircle(options) {
  return process.env.CIRCLECI
    ? {
        owner: process.env.CIRCLE_PROJECT_USERNAME,
        repo: process.env.CIRCLE_PROJECT_REPONAME,
        branch: process.env.CIRCLE_BRANCH,
        buildUrl: process.env.CIRCLE_BUILD_URL,
        ...options,
      }
    : options;
}

function validateOptions(options) {
  const requiredOptions = ['token', 'owner', 'repo', 'branch'];

  const missingOptions = requiredOptions.filter(name => !options[name]);

  if (missingOptions.length > 0) {
    throw new Error(`Missing options: ${missingOptions.join(', ')}`);
  }
}
