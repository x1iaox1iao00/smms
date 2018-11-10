var express = require('express');
var router = express.Router();
//引入crypto模块
var md5=require("crypto");
//引入
var mysql= require('mysql');
//连接数据库
var connection = mysql.createConnection({
    host     : 'localhost', //主机名
    user     : 'root', //用户账号
password : 'root', //密码
database : 'smms' //数据库名称
});
//打开数据库
connection.connect();

/* 添加账号 */
router.post('/add', function(req, res, next) {
  //接收数据
    let {pass,username,region}=req.body;

    //对密码进行md5加密
    pass=md5.createHash("md5").update(pass).digest("hex");
    let sqlStr=`insert into userTable(userName,userPwd,userGroup) values('${username}','${pass}','${region}')`;
    //执行语句
    connection.query(sqlStr, function (error, results) {
        if (error) throw error;
        else{
        if(results.affectedRows>0){
        res.send({"isOk":true,"msg":"账号添加成功"}); //执行sql语句返回的结果
        }else{
        res.send({"isOk":false,"msg":"账号添加失败"}); //执行sql语句返回的结果

        }
        }
    });
});

module.exports = router;
