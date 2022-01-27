'use strict';
import {
  DataTypes, Model, Optional
} from 'sequelize'
import { sequelize } from "./index"
import { Role } from "../interfaces/user"

interface UserAttributes {
  userUuid: string
  username: string
  email: string
  password: string
  role: Role
}



// Some attributes are optional in `User.build` and `User.create` calls
// CAN THIS BE DONE DIFFERENTLY
interface UserCreationAttributes extends Optional<UserAttributes, "userUuid"> {}

  class User extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
    userUuid!: string;
    id!: number
    username!:string
    email!:string
    password!: string
    role!: Role

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
    role: {
      type: DataTypes.ENUM,
      values: Object.values(Role),
      defaultValue: Role.USER
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: "users"
  });

  export = User