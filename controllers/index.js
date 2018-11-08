import path from 'path';

import fs from '../utils/fs';

const controllers = {};
const basename = path.basename(module.filename);

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file) => {
    const filename = path.join(__dirname, file);
    const nfile = file.substring(0, file.length - 3);
    controllers[nfile] = require(filename);
  });

module.exports = controllers;
