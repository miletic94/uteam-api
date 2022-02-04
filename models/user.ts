'use strict';
import {
  DataTypes, Model, Optional, UnknownConstraintError
} from 'sequelize'
import { sequelize } from "./index"
import { Role } from "../interfaces/user"
import bcrypt from "bcrypt"

interface UserAttributes {
  userUuid: string
  id?: number
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
    id!: number;
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
      unique: true,
      validate: {
        isEmail:true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isLongerThanSIx(value:string) {
          if(value.length < 6) {
            throw new Error("Password must be at least 6 characters long")
          }
        }
      }
    },
    role: {
      type: DataTypes.ENUM,
      values: Object.values(Role),
      defaultValue: Role.USER
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: "users",
    hooks: {
      beforeValidate(values) {
        let email = values.getDataValue("email")
        email = email.trim()
        email = email.toLowerCase()
        values.setDataValue("email", email)
      },
      async beforeSave(user) {
        const hashedPassword = await bcrypt.hash(user.password, 10)
        user.password = hashedPassword
      }
    }
  });

  export = User