import { Sequelize } from "sequelize";

//membuat koneksi ke db
const db = new Sequelize('archiving_db', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;