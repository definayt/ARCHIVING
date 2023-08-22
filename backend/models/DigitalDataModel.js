import { Sequelize } from "sequelize";
//koneksi ke db
import db from "../config/Database.js";
import DigitalFormat from "./DigitalFormatModel.js";
import Users from "./UserModel.js";

const {DataTypes} = Sequelize;

//nama tabel dan definisi kolom
const DigitalData = db.define('digital_data', {
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    file_digital:{
        type: DataTypes.TEXT('long'),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    digitalFormatId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty : true
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty : true
        }
    },
}, {
    freezeTableName: true
});

DigitalFormat.hasMany(DigitalData);
DigitalData.belongsTo(DigitalFormat, {foreignKey: 'digitalFormatId'});
Users.hasMany(DigitalData);
DigitalData.belongsTo(Users, {foreignKey: 'userId'});

export default DigitalData;