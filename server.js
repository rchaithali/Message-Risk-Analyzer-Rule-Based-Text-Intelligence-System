const auth=require("./middleware/auth");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
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
app.get("/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
});
app.post("/register", async(req,res) => {
    try{const {name,email,password}=req.body;
    const hashedPassword=await bcrypt.hash(password,10);
    const newUser=new User({
        name,email,password:hashedPassword

    });
    await newUser.save();
    res.json({
        message:"User registered successfully(password protected",
        user:{
            name:newUser.name,
            email:newUser.email,
            id:newUser._id
        }
    });
} catch(err){
    res.status(500).json({error:"Error registering user",details:err});
}
});
app.post("/login", async(req,res) => {
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({erroe:"User not found"});
        }
        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(404).json({error:"Invalid Password"});
        }
        const token=jwt.sign(
            {id:user._id,email:user.email},
            process.env.JWT_SECRET,
            {expiresIn:"1h"}
        );
        res.json({
            message:"Login succesful",
            token,
            user:{
                name:user.name,
                email:user.email,
                id:user._id
            }
        });
    } catch(err){
        res.status(500).json({error:"Login failed",details:err});
    }
});
app.get("/profile",auth,(req,res)=>{
    res.json({
        messsage:"Access granted",
        user:req.user
    });
});

connectDB();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is ruuning on port ${PORT}`);
});
// Testing commit visibility// tracking setup
