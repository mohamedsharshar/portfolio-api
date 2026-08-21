const mysql= require('mysql2');

const pool=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'portfolidb'
});
const promisePool = pool.promise();
module.exports=promisePool;