const User= require("./models/User");
const connectDB = require("./db");
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
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const newUser = await User.create({
            name,
            email,
            password
        });

        res.status(201).json({
            message: "User registered successfully",
            user: newUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

connectDB();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is ruuning on port ${PORT}`);
});
// Testing commit visibility// tracking setup
