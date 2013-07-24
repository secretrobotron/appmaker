Designer.importFiles = function () {
  // idea where we can import uploaded files
  
  $.get('/nudgepad.explorer.list', {}, function (data) {
    
    var files = new Space(data)
    files.each(function (filename, value) {
      if (!filename.match(/\.html$/))
        return true
      var name = filename.replace('.html', '')
      // If page already exists, skip it
      if (Project.get('pages ' + name))
        return true
      // If it does not exist, import it!
      Explorer.get(filename, function (data) {
        var space = $.htmlToScraps(data)
        Designer.menu.create(name, space.toString())
        
      })
      
    })

  })
  
}
