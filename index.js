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

var foodData = {
  data: [
    {   
      "name": "虾饺Har gow",
      "info": "皮白如雪，皮薄如纸，半透明，内馅隐约可见，吃起来爽滑清鲜，美味诱人。无虾的腥味，只有虾的鲜味。",
      "steps": [
        "澄粉、玉米淀粉，边搅合，边加水，直到雪花状。",
        "趁面热开始擀皮。",
        "虾仁除去泥线，虾仁切碎，少加一些肥的肉，加入、糖、盐、黑胡椒粉、油。",
        "面皮包上馅料，下锅蒸5分钟。",
      ]
    },
    {   
      "name": "凤爪 phoenix claw",
      "info": "又称鸡掌，鸡爪，凤足等。多皮、筋，胶质丰富。色泽绛红，皮层胀大而有皱纹，皮下饱含芡汁，有灌汤之感。食时，皮骨易离，皮软滑，骨酥烂，老少咸宜。",
      "steps": [
        "切好的凤爪过滚水焯过沥干。",
        "高温浸炸过再漂冷。",
        "加入五香料和卤水料焖煮再过冷河。",
        "沾生粉入油锅再配酱蒸熟。"
      ]
    },
    {   
      "name": "蛋挞Egg Tart",
      "info": "外层为松脆之挞皮，内层则为香甜的黄色凝固蛋浆。口感松软香酥，内陷丰厚，奶味蛋香浓郁。",
      "steps": [
        "将牛奶、炼乳、白糖放入同一容器中搅拌均匀，加热至糖完全溶解。",
        "冷却后加入蛋黄搅匀，蛋挞水就完成了。",
        "将蛋挞水倒入蛋挞皮内，不要倒满，防止加热时溢出。",
        "放入烤箱内(200℃)，烤20分钟左右。"
      ]
    }, 
    {   
      "name": "糯米鸡 nuomaigai",
      "info": "糯米雞是源自廣東的一種點心.。製法是以荷葉包著糯米，中央放雞肉、叉燒肉、咸蛋黃、冬菇等餡料。糯米雞除用荷葉，粽葉包外，還有不同，糯米雞用蒸具蒸熟，粽子用水煮熟的。吃起來糯米雞的米飯較軟綿，粽的米飯稍硬一些。",
      "steps": [
        "糯米加水泡一个晚上，隔水蒸熟",
        "蒸熟的米加蚝油、盐、油调味",
        "冬菇、鸡、火腿切丝调味煮熟",
        "蛋煮熟切块",
        "一层糯米，一层馅料，一层糯米，压实裹好"
      ]
    }    
  ]
  
}
app.use(express.static('classifier'))
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
    res.write(JSON.stringify(foodData.data[+data.toString()]));
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