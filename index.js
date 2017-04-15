var express = require('express');     
var app = express();                                                                                                                                                                                                                                      
var router = express.Router();
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var exec = require('child_process').exec;
var bodyParser = require('body-parser')
var fileName = './classifier/predict.py'
var spawn = require('child_process').spawn;

app.use(bodyParser({uploadDir:'./uploads'}));
app.listen(3000, function() {
  console.log('hhh')
})

app.get('/', function(req, res) {
  res.write('asdasd')
  res.end();
})

app.post('/file', function(req, res) {
  res.write('asdasd')
  res.end();
})

var python = exec('python ' + fileName , function(err, stdout, stdin) {
  if (err) {
    console.log(err)
    return;
  }
})




app.post('/uploading', function(req, res){
  //生成multiparty对象，并配置上传目标路径
  var form = new multiparty.Form({uploadDir: './files/'});
  python.stdout.on('data', function(data) {
    console.log(data.toString());
    res.write('hello, result is ' + data.toString() + '\n');
    res.end();
    python.stdout.removeAllListeners('data');
  })

  //上传完成后处理
  form.parse(req, function(err, fields, files) {
    var filesTmp = JSON.stringify(files,null,2);
    // console.log(files);
    if(err){
      console.log('parse error: ' + err);
    } else {
      var inputFile = files.file[0];
      var uploadedPath = inputFile.path;
      var dstPath = './files/food.jpg';
      //重命名为真实文件名
      fs.rename(uploadedPath, dstPath, function(err) {
        python.stdin.write('./files/food.jpg \n');
      });

    }
 });
});

// var test = exec('python ' + fileName + ' 1 ' + '2' , function(err, stdout, stdin) {
//   if (err) {
//     console.log(err)
//     return;
//   }
//   // console.log(stdin);
//   if (stdout) {
//     console.log(stdout);
//   }
// })

// console.log(test);
// test.stdin.write('./files/food.jpg \n');