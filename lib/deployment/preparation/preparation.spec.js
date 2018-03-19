const shell = require('shelljs');

jest.mock('shelljs', () => ({
  set: jest.fn(),
  mkdir: jest.fn(),
  cp: jest.fn(),
  rm: jest.fn(),
  exec: jest.fn(),
}));
jest.mock('path', () => ({ join: (...parts) => parts.join('/') }));

const { prepareDeployDirectory } = require('./');

describe('Preparation', () => {
  afterEach(jest.resetAllMocks);

  it('sets shell to throw error when an operation fails', () => {
    expect(shell.set).toBeCalledWith('-e');
  });

  it('creates deploy directory if it does not exist', () => {
    expect(shell.mkdir).not.toBeCalled();
    prepareDeployDirectory('a-directory', {});
    expect(shell.mkdir).toBeCalledWith('-p', 'a-directory');
  });

  it('pulls gh-pages branch content to deploy directory', () => {
    expect(shell.exec).not.toBeCalled();
    prepareDeployDirectory('a-directory', {});
    expect(shell.exec).toBeCalledWith(`git --work-tree=./a-directory checkout gh-pages -- .`, {
      silent: true,
    });
  });

  it('logs a message if pulling gh-pages branch content to deploy directory fails', () => {
    console.log = jest.fn();

    shell.exec.mockImplementation(() => {
      throw new Error('An error');
    });

    expect(console.log).not.toBeCalled();
    prepareDeployDirectory('a-directory', {});
    expect(console.log).toBeCalled();
  });

  it('creates branch directory if it does not exist', () => {
    expect(shell.mkdir).not.toBeCalled();
    prepareDeployDirectory('a-directory', {});
    expect(shell.mkdir).toBeCalledWith('-p', 'a-directory/branch');
  });

  it('removes branch directory to be certain it is clean', () => {
    expect(shell.rm).not.toBeCalled();
    prepareDeployDirectory('a-directory', { branch: 'a-branch' });
    expect(shell.rm).toBeCalledWith('-rf', 'a-directory/branch/a-branch');
  });

  it('moves content from directory to be deployed to branch directory', () => {
    expect(shell.cp).not.toBeCalled();
    prepareDeployDirectory('a-directory', {
      directory: 'a-directory-to-be-deployed',
      branch: 'a-branch',
    });
    expect(shell.cp).toBeCalledWith(
      '-r',
      'a-directory-to-be-deployed',
      'a-directory/branch/a-branch',
    );
  });
});
