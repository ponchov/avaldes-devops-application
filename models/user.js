module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('user', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: sequelize.literal('DEFAULT') },
    username: { type: DataTypes.STRING, allowNull: false},
    email: { type: DataTypes.STRING, allowNull: false},
    createdat: { type: DataTypes.DATE },
    updatedat: { type: DataTypes.DATE },
  });
  return Model;
};
