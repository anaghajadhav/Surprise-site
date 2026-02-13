const express = require("express");
const multer = require("multer");
const fs = require("fs");
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

// load database
let db = {};
if (fs.existsSync("database.json")) {
  db = JSON.parse(fs.readFileSync("database.json"));
}

// save database
function saveDB(){
fs.writeFileSync("database.json", JSON.stringify(db,null,2));
}

// create surprise
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

saveDB();

res.json({link:`https://surprise-site-tg2b.onrender.com/s/${id}`});
});

// open page
app.get("/s/:id",(req,res)=>{
const data=db[req.params.id];
if(!data) return res.send("❌ Surprise not found");

let balloons="";
data.items.forEach((it,i)=>{
balloons+=`
<div class="balloon" onclick="pop(${i})">🎈</div>

<div id="card${i}" class="card">
<div class="popup">
<span class="close" onclick="closeCard(${i})">❌</span>
<img src="${it.img}">
<h2>${it.msg}</h2>
</div>
</div>
`;
});

res.send(`
<html>
<head>
<title>Surprise</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body{margin:0;font-family:Arial;background:linear-gradient(45deg,#ff0080,#ff4d6d);text-align:center;color:white;}
h1{margin-top:20px}
.balloon{font-size:70px;cursor:pointer;display:inline-block;margin:20px}
.card{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85)}
.popup{background:white;color:black;padding:20px;border-radius:20px;max-width:320px;margin:auto;position:relative;top:50%;transform:translateY(-50%)}
.close{position:absolute;right:12px;top:8px;font-size:22px;cursor:pointer}
img{max-width:250px;border-radius:15px}
</style>
</head>

<body>
<h1>🎉 Surprise for ${data.name}</h1>
${balloons}

<script>
let opened=[false,false,false,false,false];
let totalOpened=0;

function pop(i){
if(!opened[i]){opened[i]=true;totalOpened++;}
document.getElementById("card"+i).style.display="block";
document.querySelectorAll(".balloon")[i].innerHTML="💥";
if(totalOpened===5){setTimeout(showFinal,800);}
}

function closeCard(i){
document.getElementById("card"+i).style.display="none";
}

function showFinal(){
let final=document.createElement("div");
final.style.position="fixed";
final.style.top="0";
final.style.left="0";
final.style.width="100%";
final.style.height="100%";
final.style.background="black";
final.style.color="white";
final.style.display="flex";
final.style.flexDirection="column";
final.style.justifyContent="center";
final.style.alignItems="center";
final.style.zIndex="9999";
final.innerHTML=\`
<h1 style="font-size:40px">❤️ Will you be my forever valentine ❤️</h1>
<p style="font-size:22px">You are my everything</p>
<audio autoplay loop>
<source src="/uploads/love.mp3" type="audio/mpeg">
</audio>
\`;
document.body.appendChild(final);
}
</script>

</body>
</html>
`);
});

app.listen(10000);

