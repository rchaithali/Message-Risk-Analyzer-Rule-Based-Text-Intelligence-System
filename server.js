const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");
dotenv.config();
const app=express();
app.use(express.json());
app.use(cors());
app.get("/ping",(req,res)=> {
    console.log("Ping route hit");
    res.json({message:"pong"});
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is ruuning on port ${PORT}`);
});
// Testing commit visibility