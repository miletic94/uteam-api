'use strict';
import {
  DataTypes, Model, Optional
} from 'sequelize'
import { sequelize } from "./index"

import User from "./user"
import Company from "./company"
import { Status } from "../interfaces/profile"

interface ProfileAttributes {
  profileUuid: string
  status: Status
  name: string
  profilePhoto: string
  userId: number
  companyId: number | null
}

interface ProfileCreationAttributes extends Optional<ProfileAttributes, "profileUuid"> {}
interface OptionalAttributes extends Optional<ProfileCreationAttributes, "companyId"> {}

  class Profile extends Model<ProfileCreationAttributes, OptionalAttributes>
    implements ProfileAttributes {
        profileUuid!: string;
        status!: Status
        name!: string
        profilePhoto!: string
        userId!: number
        companyId!: number | null


        public toJSON() {
            return {...
              this.get(), 
              id: undefined, 
              userId: undefined,
              companyId: undefined,
              createdAt: undefined,
              updatedAt: undefined
            }
        }
  };
  Profile.init({
    profileUuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    status: {
      type: DataTypes.ENUM,
      values: Object.values(Status),
      defaultValue: "pending",
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePhoto: {
      type: DataTypes.STRING,
      defaultValue: "https://image.shutterstock.com/shutterstock/photos/1373616899/display_1500/stock-vector-hand-drawn-modern-man-avatar-profile-icon-or-portrait-icon-user-flat-avatar-icon-sign-1373616899.jpg",
      validate: {
        isUrl: true
      }
    }, 
    userId: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
    },
    companyId: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: true
  }
  }, {
    sequelize,
    modelName: 'Profile',
    tableName: "profiles"
  });

  Profile.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    as: "user"
  })
  User.hasOne(Profile, {
    foreignKey: "userId",
    as: "profile"
  })

  Profile.belongsTo(Company, {
    as: "company",
    onDelete: "SET NULL"
  })
  Company.hasMany(Profile, {
    as: "profiles",
    foreignKey: "companyId"
  })
  
  export = Profile
