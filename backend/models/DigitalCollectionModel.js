import { Sequelize } from "sequelize";
//koneksi ke db
import db from "../config/Database.js";
import Collections from "./CollectionModel.js";
import DigitalData from "./DigitalDataModel.js";

const {DataTypes} = Sequelize;

//nama tabel dan definisi kolom
const DigitalCollections = db.define('digital_collection', {
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    collectionId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty : true,
        }
    },
    digitalDataId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
}, {
    freezeTableName: true
});

DigitalData.hasOne(DigitalCollections);
DigitalCollections.belongsTo(DigitalData, {foreignKey: 'digitalDataId'});
Collections.hasMany(DigitalCollections);
DigitalCollections.belongsTo(Collections, {foreignKey: 'collectionId'});


export default DigitalCollections;