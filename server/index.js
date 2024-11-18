import "dotenv/config";
import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3001;

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/health", (req, res) => {
  res.json({ message: "Health OK!" });
});

app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
