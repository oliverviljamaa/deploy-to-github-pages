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
  if (process.env.GITHUB_TOKEN) {
    return { token: process.env.GITHUB_TOKEN, ...options };
  }

  return options;
}

function extendWithCircleVariablesIfCircle(options) {
  if (process.env.CIRCLECI) {
    return {
      owner: process.env.CIRCLE_PROJECT_USERNAME,
      repo: process.env.CIRCLE_PROJECT_REPONAME,
      branch: process.env.CIRCLE_BRANCH,
      buildUrl: process.env.CIRCLE_BUILD_URL,
      ...options,
    };
  }

  return options;
}

function validateOptions(options) {
  const requiredOptions = ['token', 'owner', 'repo', 'branch'];

  const missingOptions = requiredOptions.filter(name => !options[name]);

  if (missingOptions.length > 0) {
    throw new Error(`Missing options: ${missingOptions.join(', ')}`);
  }
}
