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

function extend(base, extension) {
  return { ...extension, ...base };
}

function extendWithDefaultOptions(options) {
  return extend(options, { directory: 'public' });
}

function extendWithGithubTokenVariable(options) {
  if (process.env.GITHUB_TOKEN) {
    return extend(options, { token: process.env.GITHUB_TOKEN });
  }

  return options;
}

function extendWithCircleVariablesIfCircle(options) {
  if (process.env.CIRCLECI) {
    return extend(options, {
      owner: process.env.CIRCLE_PROJECT_USERNAME,
      repo: process.env.CIRCLE_PROJECT_REPONAME,
      branch: process.env.CIRCLE_BRANCH,
      buildUrl: process.env.CIRCLE_BUILD_URL,
    });
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
