const ghpages = require('gh-pages');

const { deployDirectoryToGithubPages } = require('./');

jest.mock('gh-pages');

describe('Github pages', () => {
  it('deploys to gh-pages', async () => {
    expect.assertions(2);
    mockPublishForCallbackArgument(undefined);

    expect(ghpages.publish).not.toBeCalled();
    await deployDirectoryToGithubPages('a-directory');
    expect(ghpages.publish).toBeCalledWith('a-directory', { add: true }, expect.any(Function));
  });

  it('throws if deployment to gh-pages fails', async () => {
    expect.assertions(1);
    mockPublishForCallbackArgument('An error');

    const directory = 'a-directory';
    try {
      await deployDirectoryToGithubPages(directory);
    } catch (err) {
      expect(err.message).toContain('An error');
    }
  });

  function mockPublishForCallbackArgument(argument) {
    ghpages.publish.mockImplementation((directory, options, callback) => {
      callback(argument);
    });
  }
});
