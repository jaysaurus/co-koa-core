// fs mock based on https://facebook.github.io/jest/docs/en/manual-mocks.html#content as of 2017-10-01

const path = require('path');

const fs = jest.genMockFromModule('fs');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null);
function __setMockFiles (newMockFiles) {
  mockFiles = Object.create(null);
  for (const file in newMockFiles) {
    const dir = path.dirname(file);
    if (!mockFiles[dir]) mockFiles[dir] = [];
    mockFiles[dir].push(path.basename(file));
  }
}

let dirExists = true;
function __setMockExistsSync (bool) {
  dirExists = bool;
}

function existsSync (dir) {
  return dirExists;
}

function readdirSync (directoryPath) {
  return mockFiles[directoryPath.replace(/\/$/, '')] || [];
}

let fileSyncThrows = false;
function __setReadFileSyncToThrow (bool) {
  fileSyncThrows = bool;
}

function readFileSync (file) {
  if (!fileSyncThrows) return { toString: () => { return 'test: '; } };
  else throw new Error();
}

function createReadStream (arg) { return arg; }

function statSync (arg) { return true; }

fs.__setReadFileSyncToThrow = __setReadFileSyncToThrow;
fs.__setMockFiles = __setMockFiles;
fs.__setMockExistsSync = __setMockExistsSync;
fs.readdirSync = readdirSync;
fs.existsSync = existsSync;
fs.readFileSync = readFileSync;
fs.createReadStream = createReadStream;
fs.statSync = statSync;
module.exports = fs;
