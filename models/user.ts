'use strict';
import {
  DataTypes, Model, Optional, UUIDV4
} from 'sequelize'
import { sequelize } from "./index"

interface UserAttributes {
  userUuid: string
  id: number
  username: string
  email: string
  password: string
}



// Some attributes are optional in `User.build` and `User.create` calls
// CAN THIS BE DONE DIFFERENTLY
interface UserCreationAttributes extends Optional<UserAttributes, "userUuid"> {}
interface OptionalAttributes extends Optional<UserCreationAttributes, "id"> {}

  class User extends Model<UserCreationAttributes, OptionalAttributes>
    implements UserAttributes {
    userUuid!: string;
    id!: number
    username!:string
    email!:string
    password!: string

    public toJSON() {
        return {...
          this.get(), 
          id: undefined, 
          createdAt: undefined,
           updatedAt: undefined
        }
    }
  };
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement:true,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
    userUuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: "users"
  });

  export = User