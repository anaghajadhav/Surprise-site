const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

let db = {};

// create surprise (5 images)
app.post("/create",
upload.fields([
{name:"img1"},{name:"img2"},{name:"img3"},{name:"img4"},{name:"img5"}
]),
(req,res)=>{

const id = uuidv4();

db[id]={
name:req.body.name,
items:[
{img:req.files.img1?"/uploads/"+req.files.img1[0].filename:"",msg:req.body.msg1},
{img:req.files.img2?"/uploads/"+req.files.img2[0].filename:"",msg:req.body.msg2},
{img:req.files.img3?"/uploads/"+req.files.img3[0].filename:"",msg:req.body.msg3},
{img:req.files.img4?"/uploads/"+req.files.img4[0].filename:"",msg:req.body.msg4},
{img:req.files.img5?"/uploads/"+req.files.img5[0].filename:"",msg:req.body.msg5}
]
};

res.json({link:`https://surprise-site-tg2b.onrender.com/s/${id}`});
});

// open balloon page
app.get("/s/:id",(req,res)=>{
const data=db[req.params.id];
if(!data) return res.send("Not found");

let balloons="";
data.items.forEach((it,i)=>{
balloons+=`
<div class="ba

