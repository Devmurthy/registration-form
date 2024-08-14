const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const dotenv=require("dotenv");

const app=express();
dotenv.config();

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.ieeii.mongodb.net/registrationFormDB&appName=Cluster0`);
//registration schema
const resgistrationSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
});
//mode of registration schema
const Registration=mongoose.model("Registration",resgistrationSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const path = require('path');
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/pages/index.html'));
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await Registration.findOne({ email: email });
        if (!existingUser) {
            // Create a new registration if the user does not exist
            const registrationData = new Registration({
                name,
                email,
                password
            });
            await registrationData.save();
            res.redirect("/success");
        } else {
            // If the user already exists, redirect to an error page
            console.log("User already exists");
            res.redirect("/error");
        }
    } catch (error) {
        console.log(error);
        res.redirect("/error");
    }
});

app.get("/success",(req,res)=>{
    res.sendFile(__dirname+"/pages/suceess.html");
})
app.get("/error",(req,res)=>{
    res.sendFile(__dirname+"/pages/error.html");
})
//app.listen(port,()=>{
   //console.log(`server is running on port ${port}`);
//})

