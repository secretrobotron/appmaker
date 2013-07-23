var Files = new Tool('Files')
Files.set('color', 'rgba(36, 65, 112, 1)')
Files.set('path', '')
Files.set('description', 'View and edit the files of your project.')

// Files.on('change', 'path', Files.RenderExplorer())

Files.on('open', function () {
  
  $('#FilesDownload').attr('href', '/nudgepad.backup/' + document.location.host + '.zip')
  Files.refresh()  
    
})

Files.on('set', function (key) {
  if (key === 'path')
    Files.renderExplorer()
})

Files.isImage = function (filename) {
  if (filename.match(/\.png|jpeg|jpg|gif$/i))
    return true
  return false
}

Files.newFile = function () {
  var newName = prompt('Enter the filename')
  if (!newName)
    return false
    
  var path = (Files.get('path') ? Files.get('path') + ' ' : '')
  Explorer.create(path + newName, '', Files.refresh)
}

Files.newFolder = function () {
  var newName = prompt('Enter the folder name')
  if (!newName)
    return false
    
  var path = (Files.get('path') ? Files.get('path') + ' ' : '')
  Explorer.mkdir(path + newName, Files.refresh)
}

Files.renderExplorer = function () {
  
  var files = Files.get('files')
  if (Files.get('path'))
    files = files.get(Files.get('path'))
  
  var explorer = '<table id="FilesExplorer">'
  explorer += '<tr class="FilesExplorerHeader"><td>Filename</td><td></td><td></td><td></td><td>Size</td><td>Age</td></tr>'
  
  var path = (Files.get('path') ? Files.get('path') + ' ' : '')
  
  // Sort files into this order: folders, then files.
  // if A is a Folder and B is a File, A before B.
  // if A and B are same type, A before B.
  
  var folders = _.filter(files.keys, function(key) {
    return !files.get(key).get('timeSinceLastChange')
  }).sort()
  
  var theFiles = _.filter(files.keys, function(key) {
    return files.get(key).get('timeSinceLastChange')
  }).sort()
  
  var filenames = folders.concat(theFiles)
  
  filenames.forEach(function (filename) {
    var file = files.get(filename)
    var row = '<tr'
    // if is file
    if (file.get('timeSinceLastChange')) {
      row += ' class="FilesExplorerFile" value="' + filename + '" path="' + path + filename + '">'
      
      if (Files.isImage(filename))
        row += '<td class="FilesExplorerPreview">' + filename + '</td>'
      else
        row += '<td class="FilesExplorerEdit">' + filename + '</td>'
      
      if (!path.match(/^private/))
        row += '<td class="FilesHiddenAction FilesExplorerVisit"><a target="published" href="/' + path.replace(/ /g, '/') + filename + '">Visit</a></td>'
      else
        row += '<td></td>'
      row += '<td class="FilesHiddenAction FilesExplorerRename">Rename</td>'
      row += '<td class="FilesHiddenAction FilesExplorerRemove">Delete</td>'
      row += '<td>' + (file.get('size')) + '</td>'
      row += '<td>' + moment(file.get('mtime')).fromNow() + '</td>'
    } else {
      row += ' class="FilesExplorerFolder" value="' + filename + '" path="' + path + filename + '">'
      row += '<td class="FilesExplorerFolderName">' + filename + '</td>'
      row += '<td></td>'
      row += '<td class="FilesHiddenAction FilesExplorerRename">Rename</td>'
      row += '<td class="FilesHiddenAction FilesExplorerRemoveFolder">Delete</td>'
      row += '<td></td><td></td>'
    }
    row += '</tr>'
    explorer += row
  })
  explorer += '</table>'
  var breadcrumb = '<span onclick="Files.set(\'path\', \'\')">' + document.location.host + '</span>'
  if (path) {
    var parent = ''
    path.split(/ /g).forEach(function (v, i) {
      breadcrumb += ' <span onclick="Files.set(\'path\', \'' + parent + v + '\')">' + v + '</span>'
      parent += v + ' '
    })
    
  }
  $('#FilesExplorerPath').html(breadcrumb)
  $('#FilesExplorerHolder').html(explorer)
}

Files.refresh = function () {
  $.get('/nudgepad.explorer.list', {}, function (data) {
    Files.set('files', new Space(data))
    Files.renderExplorer()
  })
}

$(document).on('click', '.FilesExplorerEdit', function () {
  var filepath = $(this).parent().attr('path')
  Explorer.edit(filepath)
})

$(document).on('click', '.FilesExplorerPreview', function () {
  var path = $(this).parent().attr('path').replace(/ /g, '/')
  ImagePreview('<img src="' + path + '">')
})

$(document).on('click', '.FilesExplorerRename', function () {
  var newName = prompt('Rename this file', $(this).parent().attr('value'))
  if (!newName)
    return false
  var path = (Files.get('path') ? Files.get('path') + ' ' : '')
  Explorer.rename($(this).parent().attr('path'), path + newName, Files.refresh)
})

$(document).on('click', '.FilesExplorerRemove', function (event) {
  var name = $(this).parent().attr('value')
  if (!event.metaKey && !confirm('Are you sure you want to delete ' + name + '?'))
    return false
  Explorer.remove($(this).parent().attr('path'), function () {
    Flasher.success(name + ' deleted')
    Files.refresh()
  })
})

$(document).on('click', '.FilesExplorerRemoveFolder', function () {
  var name = $(this).parent().attr('value')
  if (!event.metaKey && !confirm('Are you sure you want to delete ' + name + '?'))
    return false
  Explorer.rmdir($(this).parent().attr('path'), function () {
    Flasher.success(name + ' deleted')
    Files.refresh()
  })
})

$(document).on('click', '.FilesExplorerFolderName', function () {
  Files.set('path', $(this).parent().attr('path'))
})


