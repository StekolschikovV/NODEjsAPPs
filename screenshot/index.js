module.exports = function(io) {
    let express = require('express'),
      router  = express.Router();
      var webshot = require('webshot');
      var fs = require('fs');

    router.get("/:url/:name/:mob", function (req, res) {
      let url = req.params.url,
          mob = req.params.mob,
          name = req.params.name;
          options = '';
          if(mob == "on") {
            options = {
                screenSize: {
                  width: 320
                , height: 480
                }
                , shotSize: {
                    width: 320
                  , height: 'all'
                  }
                , userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)'
                    + ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
              };
          } else
            options = {}

      var renderStream = webshot(url,options);
      var file = fs.createWriteStream(`./screenshot/sreen/${name}.png`, {encoding: 'binary'});
      renderStream.on('data', function(data) { file.write(data.toString('binary'), 'binary'); });
      renderStream.on('end', function() {
        file.close();
        let s = fs.createReadStream(`./screenshot/sreen/${name}.png`);
        res.setHeader('Content-Type', 'image/png');
        s.pipe(res);
      });
    });
    router.get("/", function (req, res) { res.render('../tpl/screen'); });
    return router;
}
