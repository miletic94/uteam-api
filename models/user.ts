'use strict';
import {
  Model, UUIDV4
} from 'sequelize'

interface UserAttributes {
  id: string
  username: string
  email: string
  password: string
}

module.exports = (sequelize:any, DataTypes:any) => {
  class User extends Model
    implements UserAttributes {

    id!: string
    username!:string
    email!:string
    password!: string
    /**
    * Helper method for defining associations.
    * This method is not a part of Sequelize lifecycle.
    * The `models/index` file will call this method automatically.
    */
    static associate(models:any) {
      // define association here
    }

    public toJSON() {
        return {... this.get(), id: undefined}
    }
  };
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-zA-Z](?:[0-9][#%-_*])*/
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 64]
      }
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: "users"
  });
  return User;
};