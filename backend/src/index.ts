import express from "express";
import cors from "cors";
import shortid from "shortid";
import  jwt  from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { userMiddleware } from "./middleware/AuthMiddleware.js";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/signup", async (req, res) => {
  const { email,password } = req.body;
  try{
    const existingUser= await prisma.users.findUnique({
      where:{email:email}
    });
    console.log(existingUser);
    if(existingUser){
      return res.status(400).json({message:"User already exists"});
    }
    
    const newUser = await prisma.users.create({
      data:{
        email,
        password
      }
    });
    res.status(201).json({message:"User created successfully", userId:newUser.id});
  }catch(error){
    res.status(500).json({
      error
    });
  }
});

app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const user = await prisma.users.findUnique({
      where:{
        email
      }
    });
    if(!user){
      return res.status(404).json({
        message:"User not found, please SignUp"
      });
      
    }
    const token = jwt.sign({
      id:user.id
    },"jwtsecretkey",{expiresIn:"1h"});
    return res.status(201).json({
      token
    });

  }catch(err){
    return res.status(500).json({
      message:"Internal server error"
    });

  }
});

app.post("/shorten", userMiddleware,async (req, res) => {
  const { url } = req.body;
  const shortId = shortid.generate();
  const userId = req.userId;
  if(!userId){
    return;
  }
  try {
    const newUrl = await prisma.urls.create({
      data: {
        originalUrl: url,
        shortId: shortId,
        shortUrl: `http://localhost:3000/${shortId}`, 
        userId:userId

      },
    });
    //replace shortUrl with domain in production

    return res.json({ shortId: newUrl.shortId });
  } catch (error) {
    return res.status(500).json({
        message:"Internal sever error"
      });
    
  }

});

app.get("/:shortId", async (req, res) => {
  const { shortId } = req.params;

  const urlEntry = await prisma.urls.findUnique({
    where: { shortId: shortId },
  });

  if (urlEntry) {
    return res.redirect(urlEntry.originalUrl);
  } else {
    return res.status(404).json({ message: "URL not found" });
  }
});


app.get("/api/stats/:shortId", async (req, res) => {});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
