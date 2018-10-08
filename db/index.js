var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test');

var db = mongoose.connection;
db.on('error', function(error){
  console.log('数据库连接失败：' + error);
});
db.once('open', function(){
  console.log('数据库连接成功');
});