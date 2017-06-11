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
    phantom = require('phantom'),
    webshot = require('webshot'),
    node_phantom = require('node-phantom'),
    db_chat = new sqlite3.Database('../history-chat.db');




  // VIEWS SETTINGS
app.set('views', __dirname + '/tpl');
app.engine('jade', require('jade').renderFile);
app.set('view engine', 'jade');
app.use(sassMiddleware({
    src: path.join('tpl'),
    dest: path.join('tpl'),
    debug: false,
    indentedSyntax: true,
    outputStyle: 'compressed'
}));
app.use( express.static('tpl'));
app.use("/screen", express.static(__dirname + "/screenshot/sreen"));


app.use('/chat', require("./chat/index")(io, db_chat));
app.use('/screen', require("./screenshot/index")(io));




// DEV
fs.watch('tpl', {encoding: 'buffer'}, function (eventType, filename) { io.emit('reload'); });


http.listen(80);
