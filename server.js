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

app.post("/create", upload.single("photo"), (req, res) => {
  const id = uuidv4();

  db[id] = {
    name: req.body.name,
    message: req.body.message,
    password: req.body.password,
    music: req.body.music,
    photo: req.file ? "/uploads/" + req.file.filename : ""
  };

  res.json({ link: `https://surprise-site-tg2b.onrender.com/surprise/${id}` });

});

app.get("/surprise/:id", (req, res) => {
  const data = db[req.params.id];
  if (!data) return res.send("Not found");

  res.send(`
  <html>
  <head>
  <title>Surprise</title>
  <style>
  body{
  font-family:Arial;
  background:linear-gradient(45deg,#ff4d6d,#ff0080);
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
  color:white;
  text-align:center;
  }
  .card{
  background:white;
  color:black;
  padding:30px;
  border-radius:20px;
  }
  img{max-width:250px;border-radius:15px}
  </style>
  </head>

  <body>
  <div id="lock">
  <h2>Enter Password 🔐</h2>
  <input type="password" id="p">
  <button onclick="openit()">Open</button>
  </div>

  <div id="main" style="display:none">
  <div class="card">
  <h1>🎉 Surprise for ${data.name}</h1>
  <img src="${data.photo}">
  <h3>${data.message}</h3>
  <audio autoplay loop src="${data.music}"></audio>
  </div>
  </div>

  <script>
  function openit(){
  if(document.getElementById("p").value=="${data.password}"){
  document.getElementById("lock").style.display="none";
  document.getElementById("main").style.display="block";
  }else alert("Wrong password");
  }
  </script>

  </body>
  </html>
  `);
});

app.listen(10000,()=>console.log("running"));
