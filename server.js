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
const { analyzeMessage } = require("./services/riskAnalyzer");
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
      if(!name || !email || !password)
        {
    return res.status(400).json({
        error:"All fields are required"
    });   
}
if(!email.includes("@")){
    return res.status(400).json({
        error:"Invalid email format"
    });
}
if(password.length<6){
    return res.status(400).json({
        error:"Password must be at least 6 characters long"
    });
}
const existingUser= await User.findOne({email});
if(existingUser){
    return res.status(409).json({
        error:"User already in exists, please login"
    });
}


    const hashedPassword=await bcrypt.hash(password,10);
    const newUser=new User({
        name,email,password:hashedPassword

    });
    await newUser.save();
    res.json({
        message:"User registered successfully(password protected)",
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
        if(!email || !password){
            return res.status(400).json({error:"Email and password are required"});
        }
        if(!email.includes("@")){
            return res.status(400).json({error:"Invalid email format"});
        }   
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({error:"Invalid email or password"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({error:"Invalid email or password"});
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
app.get("/profile", auth, async(req,res) => {
    try{
        const user=await User.findById(req.user.id).select("-password");
       res.json({
        message:"Access Granted",
        user
       });
    } catch(err){
        res.status(500).json({error:"Error fetching profile",details:err});
    }
});
app.put("/profile", auth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ error: "Error updating profile" });
  }
});
app.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new passwords are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters long" });
    }

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error changing password" });
  }
});
app.post("/analyze", auth, (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({
            error: "Message is required"
        });
    }

    const result = analyzeMessage(message);

    res.json(result);
});
connectDB();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is ruuning on port ${PORT}`);
});
// Testing commit visibility// tracking setup
