import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';

import "dotenv/config";

import routes from "./routes.js";
import cookieParser from 'cookie-parser';
import { authMiddleware } from './middlewares/authMiddleware.js';

const app = express();

//Setup DB
const dbUrl = 'mongodb://localhost:27017';
mongoose.connect(dbUrl, {dbName: "volcanoes"}) //changeDb Name
    .then(() => console.log("DB connected successfully!"))
    .catch((err) => console.log(`DB failed to connect: ${err}`));

//Setup view engine
app.engine('hbs', handlebars.engine({
    extname: "hbs",
}));
app.set('views', "src/views");
app.set('view engine', 'hbs');

//Setup express
app.use("/static", express.static("src/static"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(authMiddleware);
app.use(routes);

app.listen(3000, () => console.log("Server is listening on port http://localhost:3000"));
