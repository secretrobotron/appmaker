Boston.importUrl = function (url) {
  $.post('/nudgepad.proxy', { url : url}, function (data) {
    
    var space = $.htmlToScraps(data)
    space = Boston.relativeToAbsolute(space.toString(), url)
    Boston.menu.create(null, space.toString())
    Flasher.success('Imported ' + url)
  })
}

Boston.importUrlPrompt = function () {
  
  var url = prompt('Enter a url to import', 'http://')
  if (!url)
    return false
  
  if (!url.match(/^https?\:\/\//))
    url = 'http://' + url
  Boston.importUrl(url)
  
}
