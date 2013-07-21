/**
 * @special Singleton
 */
var Explorer = {}

/**
 * Create file ONLY if it does not exist
 */
Explorer.create = function (path, content, callback) {
  var req = {}
  req.path = path
  req.content = content || ''
  $.post('/nudgepad.explorer.create', req, function (data) {
    callback(data)
  })
}

Explorer.downloadTimelines = function () {
  $.get('/nudgepad.project.timelines', {}, function (data) {
    var space = new Space(data)
    if (Project.get('timelines'))
      Project.get('timelines').patch(space)
  })
}

/**
 * Edit a text file
 *
 * @param {string} File you want to edit
 */
Explorer.edit = function (path) {
  var req = {}
  req.path = path
  $.post( '/nudgepad.explorer.get', req, function (data) {
    TextPrompt.open('Editing ' + path, data, function (val) {
      var req = {}
      req.path = path
      req.content = val + ''
      $.post('/nudgepad.explorer.save', req, function (err) {
        if (err)
          console.log(err)
        else
          Flasher.success(path + ' saved')
      })
    })
  })
}

Explorer.get = function (path, callback) {
  var req = {}
  req.path = path
  $.post( '/nudgepad.explorer.get', req, function (data) {
    if (callback)
      callback(data)
  })
}

Explorer.getFolder = function (path, callback) {
  var req = {}
  req.path = path
  $.post( '/nudgepad.explorer.getFolder', req, function (data) {
    if (callback)
      callback(data)
  })
}

Explorer.mkdir = function (path, callback) {
  var req = {}
  req.path = path
  $.post('/nudgepad.explorer.mkdir', req, function (err) {
    if (callback)
      callback()
  })
}

Explorer.quickEdit = function () {
  Explorer.edit(prompt('Enter path to file you want to edit', 'project.css'))
}

Explorer.remove = function (path, callback) {
  var req = {}
  req.path = path
  $.post( '/nudgepad.explorer.remove', req, function (data) {
    callback()
  })
}

Explorer.rename = function (oldPath, newPath, callback) {
  var req = {}
  req.oldPath = oldPath
  req.newPath = newPath
  if (!newPath)
    return Flasher.error('No name provided')
  $.post('/nudgepad.explorer.rename', req, function (err) {
    callback()
  })
}

Explorer.rmdir = function (path, callback) {
  var req = {}
  req.path = path
  $.post('/nudgepad.explorer.rmdir', req, function (err) {
    if (callback)
      callback()
  })
}

// Write utf8 files
Explorer.set = function (path, content, callback) {
  var req = {}
  req.path = path
  req.content = content
  $.post('/nudgepad.explorer.save', req, function (err) {
    if (callback)
      callback()
  })
}

