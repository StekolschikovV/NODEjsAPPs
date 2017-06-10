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
    db_chat = new sqlite3.Database('./chat/history.db');


  // VIEWS SETTINGS
app.set('view engine', 'jade');
app.use(sassMiddleware({
    src: path.join('tpl'),
    dest: path.join('tpl'),
    debug: true,
    indentedSyntax: true,
    outputStyle: 'compressed'
}));
app.use(express.static('tpl'));


app.use('/chat', require("./chat/index")(io, db_chat));

// DEV
fs.watch('tpl', {encoding: 'buffer'}, (eventType, filename) => { io.emit('reload'); });


http.listen(3000);
