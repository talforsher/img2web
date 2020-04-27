var express = require("express");
var app = express();


app.use(express.static('public'))


app.get("/", (res, req)=>{
      req.end(express.static('/index'))
    })
app.listen('3001')