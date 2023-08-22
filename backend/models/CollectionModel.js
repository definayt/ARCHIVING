import { ForeignKeyConstraintError, Sequelize } from "sequelize";
//koneksi ke db
import db from "../config/Database.js";
import Users from "./UserModel.js";
import Categories from "./CategoryModel.js";
import StoryType from "./StoryTypeModel.js";
import Languages from "./LanguageModel.js";

const {DataTypes} = Sequelize;

//nama tabel dan definisi kolom
const Collections = db.define('collections', {
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    no_bp:{
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            // notEmpty: false,
            // len: [1, 10],
        }
    },
    isbn:{
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            // notEmpty: false,
            // len: [1, 15],
        }
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 200],
        }
    },
    writer:{
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            // notEmpty: false,
            // len: [1, 200],
        }
    },
    publish_1st_year:{
        type: DataTypes.STRING(4),
        allowNull: true,
        validate: {
            // notEmpty: false,
        }
    },
    publish_last_year:{
        type: DataTypes.STRING(4),
        allowNull: true,
        validate: {
            // notEmpty: false,
        }
    },
    amount_printed:{
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            // notEmpty: false
        }
    },
    synopsis:{
        type: DataTypes.TEXT('long'),
        allowNull: true,
        validate: {
            
        }
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty : true
        }
    },
    storyTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty : true
        }
    },
    languageId: {
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
    }
}, {
    freezeTableName: true
});

Users.hasMany(Collections);
Collections.belongsTo(Users, {foreignKey: 'userId'});
Categories.hasMany(Collections);
Collections.belongsTo(Categories, {foreignKey: 'categoryId'});
StoryType.hasMany(Collections);
Collections.belongsTo(StoryType, {foreignKey: 'storyTypeId'});
Languages.hasMany(Collections);
Collections.belongsTo(Languages, {foreignKey: 'languageId'});

export default Collections;