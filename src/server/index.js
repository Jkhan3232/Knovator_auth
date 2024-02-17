// import dotenv from "dotenv"
// dotenv.config()
import {} from "dotenv/config";
import { app } from "./app.js";
import connectToDatabase from "../database/connect.js";
connectToDatabase()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`⚙️ Server is Running On Port No..${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Conection Faild ${err}`);
  });
