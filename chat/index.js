module.exports = function(io, db) {


    // ROUTER
    let express = require('express'),
        router  = express.Router();


    router.get("/", function (req, res) { res.render('../tpl/chat'); });


    // DOP FUNC ----------------------------------------------------------------
    function addMesToDB(txt) { var stmt = db.prepare("INSERT INTO message (txt) VALUES (?)"); stmt.run(txt); stmt.finalize(); }
    // LAST 10 MES
    function loadLast10(socket) {
		    let array = [];
        db.each("SELECT * FROM message order by ID DESC limit 10", function (err, row) {
            array.push(row.txt);
            if(array.length == 10)
              loadLast10Show(array, socket)
        });
    }
    function loadLast10Show(e, socket) {
      for (var i = 10; i > -1; i--){ socket.emit('new message show', e[i]); }
    }
    // ALL MESS
    function loadAll(socket) { db.each("SELECT * FROM message", function (err, row) { socket.emit('new message show', row.txt); }); }
    function getDateTime() {
        let date = new Date();
        let hour = date.getHours();
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
        return hour + ":" + min + ":" + sec;
    }
    // DOP FUNC ----------------------------------------------------------------

    // EMIT
    let name = '';
    let pass = '';
    io.on('connection', function (socket) {
        io.sockets.on('connection', function (client) {});
        socket.on('login', function (msg) {
            pass = msg;
            if (msg == '888') name = 'Оксана';
            else if (msg == '8888') name = 'Виталий';
            if (msg == '888' || msg == '8888')
                loadLast10(socket);
            else
              socket.emit('new message show', false);
        });
        socket.on('loadAll', function (msg) { loadAll(socket); });
        socket.on('mesText.oninput', function (msg) { socket.broadcast.emit('mesText.oninput.show') });
        socket.on('new message send', function (msg) {
            io.emit('new message show', getDateTime() + ' <span class="name">' + name + ':</span> <span class="msg">' + msg + '</span>');
            addMesToDB(getDateTime() + ' <span class="name">' + name + ':</span> <span class="msg">' + msg + '</span>');
        });
    });


    return router;
}
