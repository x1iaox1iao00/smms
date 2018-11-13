let express = require('express');
let router = express.Router();
//引入crypto模块
let md5 = require("crypto");
//引入
var connection=require("./mysqlConn");

/*获取用户名*/
router.get('/name',function (req,res) {
    username=req.cookies.username;
    if(username){
    res.send(username);
    }else{
        res.send("");
    }
});

/* 添加账号 */
router.post('/add', function (req, res) {
    //接收数据
    let {pass, username, region} = req.body;
    //对密码进行md5加密
    pass = md5.createHash("md5").update(pass).digest("hex");
    let sqlParams = [username, pass, region]; //参数数组
    let sqlStr = "insert into usertable(userName,userPwd,userGroup) values(?,?,?)"; //占位符
    //执行语句
    connection.query(sqlStr, sqlParams, function (error, results) {
        if (error) throw error;
        else {
            if (results.affectedRows > 0) {
                res.send({"isOk": true, "msg": "账号添加成功"}); //执行sql语句返回的结果
            } else {
                res.send({"isOk": false, "msg": "账号添加失败"}); //执行sql语句返回的结果

            }
        }
    });
});

// 获取所有用户
router.get("/list", (req, res) => {
    //1. 构造sql语句
    let sqlStr = "select * from usertable order by u_id DESC";

    //2. 执行sql语句
    connection.query(sqlStr, function (error, userlist) {
        if (error) throw error; //出错后面的代码不执行
        //3. 返回查询的结果到前端（对象数组）
        res.send(userlist);
    });
});

//删除账号
router.get('/del',(req,res)=>{
    let id=req.query.id;
    let sqlParams = [id];
    let sqlStr = "delete from usertable where u_id=?";
    connection.query(sqlStr, sqlParams, function (error, results){
        if (error) throw error;
            if (results.affectedRows > 0) {
                res.send({"isOk": true, "msg": "账号删除成功"});
            } else {
                res.send({"isOk": false, "msg": "账号删除失败"});
        }
    });
});

// 通过ID获取用户数据
router.get("/getUserById", (req, res) => {
    let id=req.query.id;
    //1. 构造sql语句
    let sqlStr = "select * from userTable where u_id=?";
    let sqlParams=[id];
    //2. 执行sql语句
    connection.query(sqlStr, sqlParams,function (error, userData) {
        if (error) throw error; //出错后面的代码不执行
        res.send(userData);
    });
});

/* 保存数据到后台 */
router.post('/save', function (req, res, next) {
    //接收数据
    let {pass, username, region,u_id,oldPwd} = req.body;
    if(oldPwd!==pass){
        pass = md5.createHash("md5").update(pass).digest("hex");
    }
    let sqlParams = [username, pass, region,u_id]; //参数数组
    let sqlStr="update userTable set userName=?,userPwd=?,userGroup=? where u_id=?"; //占位符
    //执行语句
    connection.query(sqlStr, sqlParams, function (error, results) {
        if (error) throw error;
        else {
            if (results.affectedRows > 0) {
                res.send({"isOk": true, "msg": "账号修改成功"}); //执行sql语句返回的结果
            } else {
                res.send({"isOk": false, "msg": "账号修改失败"}); //执行sql语句返回的结果

            }
        }
    });
});

//登录验证
router.post('/loginCheck',(req,res)=>{
  let {username,checkPass}=req.body;
  let sqlStr="select u_id from usertable where userName=? and userPwd=?";
  checkPass=md5.createHash("md5").update(checkPass).digest("hex");
  let sqlParams=[username,checkPass];
  connection.query(sqlStr,sqlParams,(err,result)=>{
      if(err)throw err;
      if(result.length>0){
          res.cookie("username",username);
          res.cookie("u_id",result[0].u_id);
          res.send({isOk:true,msg:"用户登录成功"});
      }else{
          res.send({isOk:false,msg:"用户登录失败"});
      }
  })
});

//退出登录时，清除cookie
router.get('/signOut',(req,res)=>{
    res.clearCookie('username');
    res.clearCookie('u_id');
    res.redirect('/signin.html')
});

//验证合法性
router.get('/checkState',(req,res)=>{
    let username=req.cookies.username;
   if(!username){
    res.send("alert('请先登录');location.href='signin.html'");
   }else{
       res.send("");
   }
});
module.exports = router;
