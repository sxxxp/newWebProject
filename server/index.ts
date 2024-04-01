import express, { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import stream from "./logger";
import router from "./api";
import { ignoreFavicon } from "./functions";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(morgan(":method :status :url :response-time ms", { stream }));
app.use(ignoreFavicon);
app.use(router);

app.get("/", (req: Request, res: Response) => {
  res.send("1234");
});

app.get("*", (req: Request, res: Response) => {
  throw new Error("404 not found");
});

app.listen(port, () => {
  console.log("server started!");
});
