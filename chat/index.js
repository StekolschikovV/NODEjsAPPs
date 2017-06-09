module.exports = function(io, db) {


    // ROUTER
    let express = require('express'),
        router  = express.Router(),
	      sqlite3 = require('sqlite3');


    router.get("/", function (req, res) { res.render(__dirname + '/tpl/page'); });


    // DOP FUNC
    function addMesToDB(txt) { var stmt = db.prepare("INSERT INTO message (txt) VALUES (?)"); stmt.run(txt); stmt.finalize(); }
    function loadLast10() {
		    let array = [];
        db.each("SELECT * FROM message order by ID DESC limit 10", function (err, row) {
            array.push(row.txt);
            if(array.length == 10)
              loadLast10Show(array)
        });
    }
    function loadLast10Show(e) {
      for (var i = 10; i > 0; i--)
        io.emit('new message show', e[i]);
    }
    function loadAll() { db.each("SELECT * FROM message", function (err, row) { io.emit('new message show', row.txt); }); }
    function getDateTime() {
        let date = new Date(),
            hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;
        let min = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;
        let sec = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        month = (month < 10 ? "0" : "") + month;
        let day = date.getDate();
        day = (day < 10 ? "0" : "") + day;
        return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
    }


    // EMIT
    var name = '';
    io.on('connection', function (socket) {
        io.sockets.on('connection', function (client) {});
        socket.on('login', function (msg) {
            if (msg == '888') name = 'Оксана';
            else if (msg == '8888') name = 'Виталий';
            if (msg == '888' || msg == '8888') {
                addMesToDB(getDateTime() + ' <span class="name">Вошел пользователь: ' + name + '</span>');
                loadLast10();
            }
        });
        socket.on('loadAll', function (msg) { loadAll(); });
        socket.on('new message send', function (msg) {
            io.emit('new message show', getDateTime() + ' <span class="name">' + name + ':</span> <span class="msg">' + msg + '</span>');
            addMesToDB(getDateTime() + ' <span class="name">' + name + ':</span> <span class="msg">' + msg + '</span>');
        });
        socket.on('disconnect', function () {
            io.emit('new message show', getDateTime() + '  <span class="name">Вышел пользователь: ' + name + '</span>');
            addMesToDB(getDateTime() + '  <span class="name">Вышел пользователь: ' + name + '</span>');
        });
    });


    return router;
}


















































// var express = require('express'),
//     router = express.Router(),
//     sqlite3 = require('sqlite3'),
//     app = express(),
//     http = require('http').Server(app),
//     io = require('socket.io')(http),
//     iconv = require('iconv-lite'),
//     path = require('path'),
//     sassMiddleware = require('node-sass-middleware'),
//     fs = require('fs'),
//     db = new sqlite3.Database('./history.db');
//
// // DB
// if (!fs.existsSync(__dirname + '/history.db'))
//     db.run("CREATE TABLE message (id INTEGER PRIMARY KEY AUTOINCREMENT,txt TEXT)");
//
//
//
//
//
// // ROUTER
// router.get("/", function (req, res) {
//     try{
//         res.render(__dirname + '/tpl/page');
//     } catch(err){
//         console.log(err)
//     }
//     //res.sendFile(__dirname + '/index.html');
//
//
// });
//
//
// // DOP FUNC
// function addMesToDB(txt) {
//     var stmt = db.prepare("INSERT INTO message (txt) VALUES (?)");
//     stmt.run(txt);
//     stmt.finalize();
// }
// function loadLast10() {
//     db.each("SELECT * FROM message LIMIT 10", function(err, row) {
//         io.emit('new message show', row.txt);
//     });
// }
// function loadAll() {
//     db.each("SELECT * FROM message", function(err, row) {
//         io.emit('new message show', row.txt);
//     });
// }
// function getDateTime() {
//     var date = new Date();
//     var hour = date.getHours();
//     hour = (hour < 10 ? "0" : "") + hour;
//     var min  = date.getMinutes();
//     min = (min < 10 ? "0" : "") + min;
//     var sec  = date.getSeconds();
//     sec = (sec < 10 ? "0" : "") + sec;
//     var year = date.getFullYear();
//     var month = date.getMonth() + 1;
//     month = (month < 10 ? "0" : "") + month;
//     var day  = date.getDate();
//     day = (day < 10 ? "0" : "") + day;
//     return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
// }
//
//
// // EMIT
// var name = '';
// io.on('connection', function(socket){
//     io.sockets.on('connection', function (client) {});
//     socket.on('login', function(msg){
//         if(msg == '888') name = 'Оксана';
//         else if(msg == '8888') name = 'Виталий';
//         if(msg == '888' || msg == '8888') {
//             addMesToDB(getDateTime() + ' <span class="name">Вошел пользователь: ' + name + '</span>');
//             loadLast10();
//         }
//         console.log('----------')
//     });
//     socket.on('loadAll', function(msg){
//         loadAll();
//     });
//     socket.on('new message send', function(msg){
//         io.emit('new message show', getDateTime() + ' <span class="name">' + name + ':</span> <span class="msg">' + msg + '</span>');
//         addMesToDB(getDateTime() + ' <span class="name">' + name + ':</span> ' + msg);
//     });
//     socket.on('disconnect', function () {
//         io.emit('new message show', getDateTime() + '  <span class="name">Вышел пользователь: ' + name + '</span>');
//         addMesToDB(getDateTime() + '  <span class="name">Вышел пользователь: ' + name + '</span>');
//     });
// });
//
// module.exports = router;
