const { createOptions } = require('./');

describe('Options', () => {
  beforeEach(cleanEnvironmentVariables);

  it('extends passed options with default directory to deploy, master branch, and no dotfiles', () => {
    const options = {
      token: 'a-token',
      owner: 'an-owner',
      repo: 'a-repo',
    };
    expect(createOptions(options)).toEqual({
      ...options,
      directory: 'public',
      branch: 'master',
      dotfiles: false,
    });
  });

  it('prefers passed options to default options', () => {
    const options = {
      token: 'a-token',
      owner: 'an-owner',
      repo: 'a-repo',
      branch: 'a-branch',
      directory: 'a-directory',
      dotfiles: true,
    };
    expect(createOptions(options)).toEqual(options);
  });

  it('extends passed options with github token variable if exists', () => {
    process.env.GITHUB_TOKEN = 'a-token';

    const options = {
      owner: 'an-owner',
      repo: 'a-repo',
      branch: 'a-branch',
      directory: 'a-directory',
      dotfiles: true,
    };
    expect(createOptions(options)).toEqual({ ...options, token: 'a-token' });
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
      dotfiles: false,
    });
  });

  it('throws if any required option is missing', () => {
    expect.assertions(3);

    const requiredOptions = ['token', 'owner', 'repo'];
    const fullOptions = () => ({
      token: 'a-token',
      owner: 'an-owner',
      repo: 'a-repo',
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

  function cleanEnvironmentVariables() {
    delete process.env.GITHUB_TOKEN;
    delete process.env.CIRCLECI;
    delete process.env.CIRCLE_PROJECT_USERNAME;
    delete process.env.CIRCLE_PROJECT_REPONAME;
    delete process.env.CIRCLE_BRANCH;
    delete process.env.CIRCLE_BUILD_URL;
  }
});
