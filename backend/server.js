import express from "express";
import cookieParser from "cookie-parser";

// express app
const app = express();

//connect to db
import connectDB from "./services/db.js";

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Database connection failed");
  });

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());       
app.use(cookieParser());      
import { restrictToLoggedinUserOnly, checkAuth } from "./middleware/authMiddleware.js";



// home page
app.get("/", restrictToLoggedinUserOnly, (req, res) => res.send("BidSphere Online Auction System") );

// User Route
import authRoutes from "./routes/authRoutes.js";
app.use("/bidsphere/user", authRoutes);