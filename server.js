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
<div class="balloon" onclick="pop(${i})">🎈</div>
<div id="card${i}" class="card">
<img src="${it.img}">
<h2>${it.msg}</h2>
</div>
`;
});

res.send(`
<html>
<head>
<title>Surprise</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body{
margin:0;
font-family:Arial;
background:linear-gradient(45deg,#ff0080,#ff4d6d);
text-align:center;
color:white;
overflow:hidden;
}
h1{margin-top:20px}

.balloon{
font-size:70px;
cursor:pointer;
display:inline-block;
margin:20px;
transition:transform .2s;
}

.balloon:active{
transform:scale(0.8);
}

.card{
display:none;
background:white;
color:black;
padding:20px;
border-radius:20px;
box-shadow:0 0 20px black;
margin:20px auto;
width:80%;
max-width:320px;
animation:zoom .5s;
}

img{max-width:250px;border-radius:15px}

@keyframes zoom{
from{transform:translate(-50%,-50%) scale(0)}
to{transform:translate(-50%,-50%) scale(1)}
}
</style>
</head>

<body>
<h1>🎉 Surprise for ${data.name}</h1>

${balloons}

<script>
let popped=[false,false,false,false,false];

function pop(i){
if(popped[i]) return;
popped[i]=true;

document.querySelectorAll(".balloon")[i].innerHTML="💥";

setTimeout(()=>{
let c=document.getElementById("card"+i);
c.style.display="block";
document.body.appendChild(c);
},300);
}
</script>

</body>
</html>
`);
});

app.listen(10000);


