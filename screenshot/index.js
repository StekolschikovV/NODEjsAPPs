module.exports = function(io) {
    let express = require('express'),
        router  = express.Router(),
        webshot = require('webshot'),
        path = require('path'),
        mime = require('mime'),
        fs = require('fs');

    router.get("/:url/:name/:windowSizeWidth/:windowSizeHeight/:userAgent/:streamType/:shotOffsetLeft/:shotOffsetRight/:shotOffsetTop/:shotOffsetBottom/:quality/:renderDelay/:type", function (req, res) {
        try {
            let url = req.params.url,
                mob = req.params.mob,
                windowSizeWidth = req.params.windowSizeWidth,
                windowSizeHeight = req.params.windowSizeHeight,
                streamType = req.params.streamType,
                userAgent = req.params.userAgent,
                shotOffsetLeft = req.params.shotOffsetLeft,
                shotOffsetRight = req.params.shotOffsetRight,
                shotOffsetTop = req.params.shotOffsetTop,
                shotOffsetBottom = req.params.shotOffsetBottom,
                renderDelay = req.params.renderDelay,
                quality = req.params.quality,
                type = req.params.type,
                name = req.params.name;
            if(userAgent = 'Chrome')
                userAgent = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
            else if(userAgent = 'Mozilla')
                userAgent = 'Mozilla/5.0 (Windows; U; Windows NT 6.1; rv:2.2) Gecko/20110201';
            else if(userAgent = 'Safari')
                userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A';
            else if(userAgent = 'Opera')
                userAgent = 'Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16';
            else if(userAgent = 'AndroidWebkitBrowser')
                userAgent = 'Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30';
            else if(userAgent = 'BlackBerry')
                userAgent = 'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.346 Mobile Safari/534.11+';
            else if(userAgent = 'OperaMini')
                userAgent = 'Opera/9.80 (J2ME/MIDP; Opera Mini/9.80 (S60; SymbOS; Opera Mobi/23.348; U; en) Presto/2.5.25 Version/10.54';
            else if(userAgent = 'S6')
                userAgent = 'Mozilla/5.0 (Linux; Android 6.0.1; SM-G920V Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.36';
            else if(userAgent = 'iPhone')
                userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10B329 Safari/8536.25';
            let options = {
                windowSize: { width: windowSizeWidth, height: windowSizeHeight },
                userAgent: userAgent,
                streamType: streamType,
                shotOffset: { left: shotOffsetLeft, right: shotOffsetRight, top: shotOffsetTop, bottom: shotOffsetBottom },
                quality: quality,
                renderDelay: renderDelay
            };
            let renderStream = webshot(url,options);
            let file = fs.createWriteStream(`./screenshot/sreen/${name}.png`, {encoding: 'binary'});
            renderStream.on('data', function(data) { file.write(data.toString('binary'), 'binary'); });
            renderStream.on('end', function() {
                file.close();
                if(type == "page"){
                    let s = fs.createReadStream(`./screenshot/sreen/${name}.${streamType}`);
                    res.setHeader('Content-Type', 'image/' + streamType);
                    s.pipe(res);
                } else if(type == "json"){
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({ src: req.get('host') + `/screen/${name}.${streamType}` }));
                }



                // var files = __dirname + '/sreen/' + name + '.' + streamType;
                // console.log(files)
                // var filename = path.basename(files);
                // var mimetype = mime.lookup(files);
                // res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                // res.setHeader('Content-type', mimetype);
                //
                // var filestream = fs.createReadStream(files);
                // console.log(filestream)
                // filestream.pipe(res);
                //
                // res.end();
            });
        } catch(e) { console.log(e)}
    });


    router.get("/", function (req, res) { res.render('../tpl/screen'); });


    return router;
}
