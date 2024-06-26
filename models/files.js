'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class files extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  files.init({
    name: DataTypes.STRING,
    extension: DataTypes.STRING,
    mimeType: DataTypes.STRING,
    size: DataTypes.INTEGER,
    createdAt: {
      field: 'uploadDate',
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'files',
  });
  return files;
};