import { Sequelize } from "sequelize";
//koneksi ke db
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

//nama tabel dan definisi kolom
const Languages = db.define('languages', {
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    language:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
}, {
    freezeTableName: true
});

export default Languages;