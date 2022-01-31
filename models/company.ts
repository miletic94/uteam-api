'use strict';
import {
  DataTypes, Model, Optional
} from 'sequelize'
import { sequelize } from "./index"

interface CompanyAttributes {
    companyUuid: string
    name: string
    logo: string
    slug: string
}



// Some attributes are optional in `Company.build` and `Company.create` calls
// CAN THIS BE DONE DIFFERENTLY
interface CompanyCreationAttributes extends Optional<CompanyAttributes, "companyUuid"> {}

  class Company extends Model<CompanyAttributes, CompanyCreationAttributes>
    implements CompanyAttributes {
    companyUuid!: string;
    id!: number
    name!:string
    logo!: string
    slug!: string

    public toJSON() {
        return {...
          this.get(), 
          id: undefined
        }
    }
  };
  Company.init({
    companyUuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    logo: {
        type: DataTypes.STRING,
        defaultValue: "https://cdn4.vectorstock.com/i/1000x1000/18/58/swoosh-generic-logo-vector-21061858.jpg",
        validate: {
            isUrl: true
        }
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
  }, {
    sequelize,
    modelName: 'Company',
    tableName: "companies"
  });

  export = Company 