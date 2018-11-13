let mysql = require('mysql');
//连接数据库
let connection = mysql.createConnection({
    host: 'localhost', //主机名
    user: 'root', //用户账号
    password: 'root', //密码
    database: 'smms' //数据库名称
});
//打开数据库
connection.connect();
module.exports = connection;