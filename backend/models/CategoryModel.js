import { Sequelize } from "sequelize";
//koneksi ke db
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

//nama tabel dan definisi kolom
const Categories = db.define('categories', {
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    code:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    category:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
}, {
    freezeTableName: true
});

export default Categories;