import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import CollectionRoute from "./routes/CollectionRoute.js";
import LanguageRoute from "./routes/LanguageRoute.js";
import CategoryRoute from "./routes/CategoryRoute.js";
import StoryTypeRoute from "./routes/StoryTypeRoute.js";
import DigitalFormatRoute from "./routes/DigitalFormatRoute.js";
import DigitalDataRoute from "./routes/DigitalDataRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
dotenv.config();

const app = express();
const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db,
});

// (async()=>{
//     await db.sync();
// })();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto' //untuk https true, http false. auto => detect http dan https
    }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000' //alamat front end (react menggunakan port 3000)
}));

app.use(express.json()); //agar bisa menerima data json

app.use(UserRoute);
app.use(CollectionRoute);
app.use(LanguageRoute);
app.use(CategoryRoute);
app.use(StoryTypeRoute);
app.use(DigitalFormatRoute);
app.use(DigitalDataRoute);
app.use(AuthRoute);

// store.sync();

app.listen(process.env.APP_PORT, ()=>{
    console.log('Server up and running...');
});