import express from "express";
import configViewEngine from "./configs/viewEngine";
import initApiHotelRoutes from "./routes/hotel";
import configCors from "./configs/cors";
import connectDB from "./configs/connectDB";
require("dotenv").config();
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

const app = express();

configViewEngine(app);
configCors(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//config cookie-parser
app.use(cookieParser());
initApiHotelRoutes(app);

app.use((req, res) => {
  const path = req.path;
  console.log(`Đã gọi đường dẫn URL: ${path}`);
  return res.send("Opp! 404 not found");
});
connectDB();

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(">> Hotel API APP Backend is running on the port = ", PORT);
});
