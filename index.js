var express = require('express'),
    sqlite3 = require('sqlite3'),
    app = express(),
    router = express.Router(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    iconv = require('iconv-lite'),
    path = require('path'),
    sassMiddleware = require('node-sass-middleware'),
    fs = require('fs'),
    db = new sqlite3.Database('history.db');


  // VIEWS SETTINGS
app.set('views engine', __dirname + '/chat/tpl');
app.set('view engine', 'jade');
app.use(sassMiddleware({
    src: path.join(__dirname, '/chat/tpl'),
    dest: path.join(__dirname, '/chat/tpl'),
    debug: true,
    indentedSyntax: true,
    outputStyle: 'compressed'
}));
app.use(express.static(__dirname + '/chat/tpl'));


app.use('/chat', require("./chat/index")(io, db));

// DEV
fs.watch('./chat/tpl', {encoding: 'buffer'}, (eventType, filename) => { io.emit('reload'); });


http.listen(3000);
