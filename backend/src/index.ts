import express from 'express';
import cors from 'cors';
import shortid from "shortid";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/shorten',async (req,res)=>{
    const { url } = req.body;
    const shortId = shortid.generate();
    
    res.json({ shortId });
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});



