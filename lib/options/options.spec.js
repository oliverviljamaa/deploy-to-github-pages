const { createOptions } = require('./');

describe('Options', () => {
  it('extends passed options with default directory to deploy', () => {
    const options = {
      token: 'a-token',
      owner: 'an-owner',
      repo: 'a-repo',
      branch: 'a-branch',
    };
    expect(createOptions(options)).toEqual({ ...options, directory: 'public' });
  });

  it('extends passed options with github token variable if exists', () => {
    process.env.GITHUB_TOKEN = 'a-token';

    const options = {
      owner: 'an-owner',
      repo: 'a-repo',
      branch: 'a-branch',
      directory: 'a-directory',
    };
    expect(createOptions(options)).toEqual({ ...options, token: 'a-token' });

    delete process.env.GITHUB_TOKEN;
  });

  it('extends passed options with circle variables if circle', () => {
    process.env.CIRCLECI = true;
    process.env.CIRCLE_PROJECT_USERNAME = 'an-owner';
    process.env.CIRCLE_PROJECT_REPONAME = 'a-repo';
    process.env.CIRCLE_BRANCH = 'a-branch';
    process.env.CIRCLE_BUILD_URL = '/a-build-url';

    const options = { token: 'a-token', directory: 'a-directory' };

    expect(createOptions(options)).toEqual({
      token: 'a-token',
      owner: 'an-owner',
      repo: 'a-repo',
      branch: 'a-branch',
      buildUrl: '/a-build-url',
      directory: 'a-directory',
    });

    delete process.env.CIRCLECI;
    delete process.env.CIRCLE_PROJECT_USERNAME;
    delete process.env.CIRCLE_PROJECT_REPONAME;
    delete process.env.CIRCLE_BRANCH;
    delete process.env.CIRCLE_BUILD_URL;
  });

  it('throws if any required option is missing', () => {
    expect.assertions(4);

    const requiredOptions = ['token', 'owner', 'repo', 'branch'];
    const fullOptions = () => ({
      token: 'a-token',
      owner: 'an-owner',
      repo: 'a-repo',
      branch: 'a-branch',
    });

    requiredOptions.forEach(name => {
      const options = fullOptions();

      delete options[name];

      try {
        createOptions(options);
      } catch (err) {
        expect(err.message).toContain(name);
      }
    });
  });
});
