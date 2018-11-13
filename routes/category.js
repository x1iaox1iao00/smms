let express = require('express');
let router = express.Router();

//引入
let connection=require("./mysqlConn");

/* 添加分类 */
router.post('/add', function (req, res) {
    //接收数据
    let {cg_fatherID, cg_name, cg_isLocked} = req.body;
    let sqlParams = [cg_fatherID, cg_name, cg_isLocked]; //参数数组
    let sqlStr = "insert into categoryGoods(cg_fatherID, cg_name, cg_isLocked) values(?,?,?)"; //占位符
    //执行语句
    connection.query(sqlStr, sqlParams, function (error, results) {
        if (error) throw error;
        else {
            if (results.affectedRows > 0) {
                res.send({"isOk": true, "msg": "分类添加成功"});
            } else {
                res.send({"isOk": false, "msg": "分类添加失败"});

            }
        }
    });
});

// 获取所有商品
router.get("/list", (req, res) => {
    //1. 构造sql语句
    let sqlStr="select t1.*,t2.cg_name as father_name from categorygoods as t1 left join categorygoods as t2 on t1.cg_fatherID=t2.cg_id";


    //2. 执行sql语句
    connection.query(sqlStr, function (error, categorylist) {
        if (error) throw error; //出错后面的代码不执行
        //3. 返回查询的结果到前端（对象数组）
        res.send(categorylist);
    });
});

//删除商品
router.get('/del',(req,res)=>{
    let id=req.query.id;
    let sqlParams = [id];
    let sqlStr = "delete from categorygoods where cg_id=?";
    connection.query(sqlStr, sqlParams, function (error, results){
        if (error) throw error;
        if (results.affectedRows > 0) {
            res.send({"isOk": true, "msg": "商品删除成功"});
        } else {
            res.send({"isOk": false, "msg": "商品删除失败"});
        }
    });
});

// 通过ID获取分类数据
router.get("/getCateById", (req, res) => {
    let id=req.query.id;
    //1. 构造sql语句
    let sqlStr = "select * from categoryGoods where cg_id=?";
    let sqlParams=[id];
    //2. 执行sql语句
    connection.query(sqlStr, sqlParams,function (error, sortData) {
        if (error) throw error; //出错后面的代码不执行
        res.send(sortData);
    });
});

/* 保存数据到后台 */
router.post('/save', function (req, res) {
    //接收数据
    let {cg_fatherID, cg_name, cg_isLocked ,cg_id} = req.body;
    let sqlParams = [cg_fatherID, cg_name, cg_isLocked,cg_id]; //参数数组
    let sqlStr="update categorygoods set cg_fatherID=?,cg_name=?,cg_isLocked=? where cg_id=?"; //占位符
    //执行语句

    connection.query(sqlStr, sqlParams, function (error, results) {
        if (error) throw error;
        else {
            if (results.affectedRows > 0) {
                res.send({"isOk": true, "msg": "分类修改成功"}); //执行sql语句返回的结果
            } else {
                res.send({"isOk": false, "msg": "分类修改失败"}); //执行sql语句返回的结果

            }
        }
    });
});


module.exports = router;
