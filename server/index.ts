import express, { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import stream from "./logger";
import cors from "cors";
import router from "./api";
import { ignoreFavicon } from "./functions";

dotenv.config();

const app = express();
const port = process.env.PORT;
const corsOption: cors.CorsOptions = {
  origin: ["localhost:3000", "127.0.0.1:3000", true],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(morgan(":method :status :url :response-time ms", { stream }));
app.use(ignoreFavicon);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOption));
app.use(router);

app.get("/", (req: Request, res: Response) => {
  res.send("1234");
});

app.get("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "404 Not Found" });
});

app.listen(port, () => {
  console.log("server started!");
});
