import "dotenv/config";
import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/db/index.js";

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

//routes
import userRoute from "./src/routes/user.route.js";
app.use("/api/v1/user", userRoute);

import notFound from "./src/utils/notFound.js";

app.use(notFound);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`App listening at port ${port}`);
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });
