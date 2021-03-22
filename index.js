var express = require('express'),
  fs = require('fs'),
  sharp = require('sharp'),
  url = require('url'),
  multer = require('multer'),
  pretty = require('pretty'),
  bodyParser = require('body-parser');
const { exec } = require('child_process');

var app = express();

var upload = multer({
  dest: 'public/'
})

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public', {
  extensions: ['html', 'htm']
}))

app.get('/editjs', function (req, res) {

  if (req.headers.referer.split('?')[req.headers.referer.split('?').length-1] == 'edit')
    fs.readFile('public/edit.js', function (err, data) {
      res.end(data)
    })
    else
  res.end('console.log("no-edit")')
})

app.get('/editcss', function (req, res) {

  if (req.headers.referer.split('?')[req.headers.referer.split('?').length-1] == 'edit')
    fs.readFile('public/edit.css', function (err, data) {
      res.end(data)
    })
    else
  res.end('console.log("no-edit")')
})

app.post('/save', function (request, respond) {
  const filename = request.body.filename
  const content = request.body.content
  fs.writeFile('public/' + filename, pretty(content), function () {
    console.log("saved " + filename)
  })
  const urls = request.body.urls;
  urls.forEach(element => {
    fs.writeFile('public/' + element + '.html', pretty(content), {
      flag: 'wx'
    }, function () {
      console.log("saved " + element)
    })
  });
  exec('deploy.bat', (err) => {
    if (err) {
      console.error(err)
    } else {
     console.log(`deployed`);
    }
  });
  respond.end()
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Our app is running on port ${ PORT }`);
});


app.post('/upload', upload.single('file'), (req, res, next) => {
  const rand = Math.round(Math.random()*1000)
  const newPath = 'public\\img'+rand+'.webp'
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  sharp(__dirname + "\\" +file.path).toFile(newPath, (err, info) => { 
    res.end(String(rand))
  });
})
