let express = require('express');
let router = express.Router();

//引入
let connection=require("./mysqlConn");

/* 添加分类 */
router.post('/add', function (req, res) {
    //接收数据
    let {cg_id,barcode,goodsname,goodsprice,marketprice,saleprice,stockNum,weigth,unit,promotion,discount,goodsDetails}=req.body;

    //3. 链接数据库，把数据库写入数据库
    //定义sql语句
    let sqlStr="insert into goodsTable(cg_id,barcode,goodsname,goodsprice,marketprice,saleprice,stockNum,weigth,unit,promotion,discount,goodsDetails) values(?,?,?,?,?,?,?,?,?,?,?,?)"; //占位符
    let sqlParams=[cg_id,barcode,goodsname,goodsprice,marketprice,saleprice,stockNum,weigth,unit,promotion,discount,goodsDetails]; //参数数组
    //执行sql语句
    connection.query(sqlStr,sqlParams, function (error, results) {
        if (error) throw error; //出错对象
        //4. 返回处理的结果到前端
        //"affectedRows":1, 返回受影响的行数，如果大于0就表示成功
        if(results.affectedRows>0){
            res.send({"isOk":true,"msg":"商品信息添加成功!"});
        }
        else{
            res.send({"isOk":false,"msg":"商品信息失败!"});
        }
    });
});

// 获取商品的分页数据信息
router.get("/listPagerSearch",(req,res)=>{
    //接收页码\每页大小\关键词\分类id
    let {currentPage,pageSize,keywords,category}=req.query;

    //构造sql
    let sqlStr="select t1.*,t2.cg_name from goodsTable as t1 left join categorygoods as t2 on t1.cg_id=t2.cg_id where 1=1";

    //执行全表sql查询：获取总的记录条数
    connection.query(sqlStr,(err,goodsList)=>{
        if(err) throw err;
        let total=goodsList.length; //总条数

        //关键词
        if(keywords.length>0){
            sqlStr+=` and (t1.barcode like '%${keywords}%' or t1.goodsname like '%${keywords}%')`;
        }

        //分类
        if(category.length>0){
            sqlStr+=` and t1.cg_id=${category}`;
        }
        //执行查询的sql结果
        if(keywords.length>0 || category.length>0){
            connection.query(sqlStr,(err,searchList)=>{
                if(err) throw err;
                //修改原来的总记录为查询后的记录数
                total=searchList.length;
            });
        }

        //定义分页参数数组
        let skip=(currentPage - 1)*pageSize; //跳过的条数
        let sqlParams=[skip,parseInt(pageSize)];
        sqlStr+=" limit ?,?";

        //执行查询当前页码应该显示的分页数据
        connection.query(sqlStr,sqlParams,(err,goodsPager)=>{
            if(err) throw err;
            res.send({"total":total,"datalist":goodsPager});
        });
    });
});

//删除商品
router.get('/del',(req,res)=>{
    let id=req.query.id;
    let sqlParams = [id];
    let sqlStr = "delete from goodstable where good_id=?";
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
router.get("/getGoodsById", (req, res) => {
    let id=req.query.id;
    //1. 构造sql语句
    let sqlStr = "select * from goodstable where good_id=?";
    let sqlParams=[id];
    //2. 执行sql语句
    connection.query(sqlStr, sqlParams,function (error, data) {
        if (error) throw error; //出错后面的代码不执行
        res.send(data);
    });
});

/* 保存数据到后台 */
router.post('/save', function (req, res) {
    //接收数据
    let {cg_id,barcode,goodsname,goodsprice,marketprice,saleprice,stockNum,weigth,unit,promotion,discount,goodsDetails,good_id} = req.body;
    let sqlParams = [cg_id,barcode,goodsname,goodsprice,marketprice,saleprice,stockNum,weigth,unit,promotion,discount,goodsDetails,good_id]; //参数数组
    let sqlStr="update goodstable set cg_id=?,barcode=?,goodsname=?,goodsprice=?,marketprice=?,saleprice=?,stockNum=?,weigth=?,unit=?,promotion=?,discount=?,goodsDetails=? where good_id=?"; //占位符
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
