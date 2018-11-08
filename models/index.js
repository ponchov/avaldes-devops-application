import path from 'path';
import Sequelize from 'sequelize';

import config from '../helpers/config_helper';
import fs from '../utils/fs';

const basename = path.basename(module.filename);
const db = {};
const sequelize = new Sequelize(
  config.database.name,
  config.database.username,
  config.database.password,
  config.database.options,
);

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

// clears up any confusion
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
