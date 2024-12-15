import "dotenv/config";
import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/db/index.js";
import { app, server } from "./src/socket/socket.js";

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
import postRoute from "./src/routes/post.route.js";
import messageRoute from "./src/routes/message.route.js";

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

//not found
import notFound from "./src/utils/notFound.js";

app.use(notFound);

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`App listening at port ${port}`);
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });
