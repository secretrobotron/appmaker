Designer.importUrl = function (url) {
  $.post('/nudgepad.proxy', { url : url}, function (data) {
    
    var space = $.htmlToScraps(data)
    space = Designer.relativeToAbsolute(space.toString(), url)
    Designer.menu.create(null, space.toString())
    Flasher.success('Imported ' + url)
  })
}

Designer.importUrlPrompt = function () {
  
  var url = prompt('Enter a url to import', 'http://')
  if (!url)
    return false
  
  if (!url.match(/^https?\:\/\//))
    url = 'http://' + url
  Designer.importUrl(url)
  
}
