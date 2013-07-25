var exec = require('child_process').exec,
    fs = require('fs')

var Exporter = function (app) {
  
  
  
  app.get(app.pathPrefix + 'export', app.checkId, function (req, res, next) {
    var output = app.paths['private'] + app.domain + '.space'
    exec('space ' + app.paths.project + ' ' + output, function () {
      res.set('Content-Type', 'text/plain')
      res.sendfile(output, function () {
        fs.unlink(output)
      })
    })
  }) 
}

module.exports = Exporter
