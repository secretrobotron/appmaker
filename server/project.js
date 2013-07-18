var Space = require('space'),
    os = require("os")

/**
 * Middleware. Parse the posted space.
 *
 * @param {object}
 * @param {object}
 * @param {object}
 */
parseSpace = function(req, res, next) {
  // No space received
  if (typeof req.body.space != 'string')
    return res.send('No Space received')
  req.space = new Space(req.body.space)
  next()
}

var ProjectRoute = function (app) {

  // Todo: remove
  // Get folder
  app.get(/^\/nudgepad\.project\.([a-z0-9_]+)$/, app.checkId, function(req, res, next) {

    var folder = req.params[0]

    if (!app.Project.get(folder))
      return res.send('No folder named ' + folder, 400)

    res.set('Content-Type', 'text/plain')
    return res.send(app.Project.get(folder).toString())
  })

  // Download all project for editing
  app.get('/nudgepad\.project', app.checkId, function (req, res, next) {

    var copy = new Space()
    copy.set('pages', app.Project.get('pages'))
    copy.set('started', app.started)
    var hostname = os.hostname()
    if (app.development)
      hostname = 'localhost'
    copy.set('hostname', hostname)
    res.set('Content-Type', 'text/plain')
    res.send(copy.toString())
  })
  
}

module.exports = ProjectRoute
