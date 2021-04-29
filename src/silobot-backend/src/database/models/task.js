const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Task.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false
    },
    kodeMatkul: {
      type: DataTypes.STRING,
      allowNull: false
    },
    taskType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    taskTopic: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    freezeTableName: true,
    paranoid: true,
  });
  return Task;
};