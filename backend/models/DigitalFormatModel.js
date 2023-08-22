import { Sequelize } from "sequelize";
//koneksi ke db
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

//nama tabel dan definisi kolom
const DigitalFormat = db.define('digital_format', {
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    digital_format:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
}, {
    freezeTableName: true
});

export default DigitalFormat;