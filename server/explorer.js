var fs = require('fs'),
    Space = require('space'),
    async = require('async'),
    mkdirp = require('mkdirp'),
    exec = require('child_process').exec,
    _ = require('underscore')

function fileStats (path, callback) {
  
  fs.stat(path, function (err, stat) {

    // Quit on error
    if (err)
      return callback(err)

    if (stat.isDirectory())
      return folderStats(path + '/', callback)

    var space = new Space()
    space.set('mtime', stat.mtime.getTime())
    space.set('size', (stat.size/1000000).toFixed(1) + 'MB')
    space.set('bytes', stat.size)
    space.set('age', ((new Date().getTime() - stat.ctime.getTime())/86400000).toFixed(1) + 'D')
    space.set('freshness', ((new Date().getTime() - stat.mtime.getTime())/1000).toFixed(0) + 'S')
    space.set('timeSinceLastChange', ((new Date().getTime() - stat.mtime.getTime())/86400000).toFixed(1) + 'D')
    space.set('oneliner', space.get('bytes') + ' ' + space.get('mtime'))

    callback(false, space)
  })
  
}

function folderStats (path, callback) {
  
  fs.readdir(path, function (err, files) {
    
    if (err)
      return callback(err)
    
    var space = new Space()
    var paths = _.map(files, function (value){return path + value})
    
    async.mapSeries(paths, fileStats, function(err, stats){

      if (err)
        return callback(err)
      
      // stats is now an array of stats for each file
      for (var i in files) {
        space.set(files[i], stats[i])
      }
      
      callback(false, space)
    })    
  
  })
 
}

var Explorer = function (app) {
  
  
  
  
  /**
   * Get a file API.
   * path
   */
  app.get(app.pathPrefix + 'explorer.list', app.checkId, function(req, res, next) {
    folderStats(app.paths.project, function (err, space) {
      res.set('Content-Type', 'text/plain')
      return res.send(space.toString())    
    })
  })

  /**
   * Get a file API.
   * path
   */
  app.get(app.pathPrefix + 'explorer.public', app.checkId, function(req, res, next) {
    folderStats(app.paths.project, function (err, space) {
      res.set('Content-Type', 'text/plain')
      return res.send(space.toString())    
    })
  })

  /**
   * Get a file API.
   * path
   */
  app.post(app.pathPrefix + 'explorer.get', app.checkId, function(req, res, next) {
    var path = req.body.path.trim().replace(/ /g, '/')
    fs.readFile(app.paths.project + path, 'utf8', function (err, contents) {
      res.send(contents)
    })
  })
  
  /**
   * Get a file API.
   * path
   */
  app.post(app.pathPrefix + 'explorer.getFolder', app.checkId, function(req, res, next) {
    var path = app.paths['private'] + req.body.path.trim().replace(/ /g, '/')
    var output = app.paths['private'] + 'temp.space'
    exec('space ' + path + ' ' + output, function () {
      res.set('Content-Type', 'text/plain')
      res.sendfile(output, function () {
        fs.unlink(output)
      })
    })
  })

  /**
   * Remove a file API.
   * path
   */
  app.post(app.pathPrefix + 'explorer.remove', app.checkId, function(req, res, next) {
    var path = req.body.path.replace(/ /g, '/')
    fs.unlink(app.paths.project + path, function (err) {
      if (err) return res.send(err)
      res.send('')
    })

  })

  /**
   * Rename a file API.
   * path
   */
  app.post(app.pathPrefix + 'explorer.rename', app.checkId, function(req, res, next) {
    var oldPath = req.body.oldPath.replace(/ /g, '/')
    var newPath = req.body.newPath.replace(/ /g, '/')
    fs.rename(app.paths.project + oldPath, app.paths.project + newPath, function (err) {
      if (err) return res.send(err)
      res.send('')
    })

  })


  /**
   * Save a file API.
   * path
   * content
   */
  app.post(app.pathPrefix + 'explorer.save', app.checkId, function(req, res, next) {
    var path = req.body.path.replace(/ /g, '/')
    fs.writeFile(app.paths.project + path, req.body.content, 'utf8', function (err) {
      if (err) return res.send(err)
      res.send('')
    })

  })
  
  /**
   * Create a file ONLY if it does not already exist
   * path
   * content
   */
  app.post(app.pathPrefix + 'explorer.create', app.checkId, function(req, res, next) {
    var path = app.paths.project + req.body.path.replace(/ /g, '/')
    fs.exists(path, function (exists) {
      if (exists)
        return res.send(path + ' already exists')
      fs.writeFile(path, req.body.content || '', 'utf8', function (err) {
        if (err)
          return res.send(err)
        res.send('')
      })
    })
  })
  
  /**
   * path
   */
  app.post(app.pathPrefix + 'explorer.mkdir', app.checkId, function(req, res, next) {
    var path = req.body.path.replace(/ /g, '/')
    fs.mkdir(app.paths.project + path, function (err) {
      if (err) return res.send(err)
      res.send('')
    })

  })
  
  /**
   * path
   */
  app.post(app.pathPrefix + 'explorer.rmdir', app.checkId, function(req, res, next) {
    
    var path = req.body.path.replace(/ /g, '/')
    // todo: remove and .s
    path = app.paths.project + path
    exec('rm -rf ' + path, function () {
      res.send('')
    })

  })
  
  // Receive any uploads
  app.post(app.pathPrefix + 'explorer.upload', app.checkId, function(req, res, next) {
    var filename = req.body.filename
    console.log('Receiving upload: %s', filename)
    var path = req.query.path || ''
    if (path) {
      mkdirp(app.paths.project + path, function (err) {
        if (err)
          return res.send(err)
        fs.rename(req.files.myFile.path, app.paths.project + path + filename, function (err) {
          res.send(req.body.filename + ' uploaded')  
        })
      })
    }
    else {
      fs.rename(req.files.myFile.path, app.paths.project + path + filename, function (err) {
        res.send(req.body.filename + ' uploaded')  
      })
    }

  })
  
}

module.exports = Explorer
