import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Room.hasMany(models.Message, {foreignKey: 'roomId'})
      Room.belongsToMany(models.User, {through: models.UserRoom, foreignKey: roomId})
    }
  }
  Room.init(
    { 
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      }, 
      name: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      isGroup: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Room",
      timestamps: true,
    },
  );
  return Room;
};
