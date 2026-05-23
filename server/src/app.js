import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import morgan from "morgan"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Always load server/.env (cwd can differ when using nodemon)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app=express();

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}))

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'))


export {app};