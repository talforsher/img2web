var express = require('express'),
    fs = require('fs')
    url = require('url')
    cors = require('cors');
    bodyParser = require('body-parser');
var app = express();

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(cors({
    origin: 'http://localhost:3001'
  }));
  app.use(express.static('public',{extensions: ['html', 'htm']}))
  app.get("/", (res, req)=>{
    req.end(express.static('/index'))
  })

app.post('/receive', function(request, respond) {
    console.log(request.body.filename)
    const filename = request.body.filename
    const content = request.body.content
    fs.writeFile('public/'+filename, content, function(){
        console.log("success")
    }
    )
    respond.end("Thank You")
});
app.listen(3000);
