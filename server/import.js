var exec = require('child_process').exec,
    fs = require('fs')

function Importer (app) {

  // Import a project
  app.post(app.pathPrefix + 'import', app.checkId, function (req, res, next) {
    var output = app.paths['private'] + app.domain + '.space'
    fs.writeFile(output, req.body.space, function (err, data) {
      exec('space ' + output + ' ' + app.paths.project, function () {
        res.set('Content-Type', 'text/plain')
        fs.unlink(output)
        res.send('Okay')
      })
    })
  })
}


module.exports = Importer
