import express from "express";
import dotenv from "dotenv";
import { connectToDatabase } from "./config/database";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import routes from "./routes";

dotenv.config();
const port: number = Number(process.env.PORT) || 8000;
const MONGO_URL: string = String(process.env.MONGO_URL);
const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
  })
  );
app.use(compression());
app.use(cookieParser());
app.use(express.static('src/uploads'));
app.use("/", routes());

// connect to database function
connectToDatabase(MONGO_URL);

    app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});